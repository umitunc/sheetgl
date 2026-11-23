import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StreamingEngine } from '../../src/datagrid/core/StreamingEngine';
import { IDataStore } from '../../src/datagrid/types/store';

describe('StreamingEngine', () => {
  let engine: StreamingEngine;

  beforeEach(() => {
    engine = new StreamingEngine();
  });

  function createMockStore(initialData: any[] = []): IDataStore {
    const rawData = [...initialData];
    return {
      rawData,
      getRowCount: vi.fn(() => rawData.length),
      getViewRow: vi.fn((idx: number) => {
        const row = rawData[idx];
        return row ? { type: 'data', data: row } : null;
      }),
      setCell: vi.fn(async (rowKey: any, colId: string, val: any) => {
        const row = rawData.find((r) => r.id === rowKey);
        if (row) row[colId] = val;
      }),
      setCellsBatch: vi.fn(async (batch: Array<{ rowKey: any; columnId: string; value: any }>) => {
        for (const item of batch) {
          const row = rawData.find((r) => r.id === item.rowKey);
          if (row) row[item.columnId] = item.value;
        }
      }),
    } as unknown as IDataStore;
  }

  describe('Initialization & Defaults', () => {
    it('should initialize with empty flashMap and 600ms flashDuration', () => {
      expect(engine.flashMap.size).toBe(0);
      expect(engine.flashDuration).toBe(600);
      expect(engine.hasActiveFlashes()).toBe(false);
    });
  });

  describe('applyTransaction & Delta Calculation', () => {
    it('should return early when updates array is empty or null', async () => {
      const store = createMockStore();
      await engine.applyTransaction([], 'id', store);
      await engine.applyTransaction(null as any, 'id', store);
      expect(engine.flashMap.size).toBe(0);
      expect(store.setCellsBatch).not.toHaveBeenCalled();
    });

    it('should calculate "up" flash when numeric value increases', async () => {
      const store = createMockStore([
        { id: 101, symbol: 'AAPL', price: 150.0 },
      ]);

      await engine.applyTransaction(
        [{ id: 101, price: 155.5 }],
        'id',
        store
      );

      expect(engine.flashMap.has('101:price')).toBe(true);
      const flash = engine.flashMap.get('101:price');
      expect(flash?.type).toBe('up');
      expect(store.setCellsBatch).toHaveBeenCalledWith([
        { rowKey: 101, columnId: 'price', value: 155.5 },
      ]);
    });

    it('should calculate "down" flash when numeric value decreases', async () => {
      const store = createMockStore([
        { id: 102, symbol: 'TSLA', price: 220.0 },
      ]);

      await engine.applyTransaction(
        [{ id: 102, price: 215.2 }],
        'id',
        store
      );

      expect(engine.flashMap.has('102:price')).toBe(true);
      const flash = engine.flashMap.get('102:price');
      expect(flash?.type).toBe('down');
    });

    it('should calculate "neutral" flash when non-numeric string value changes', async () => {
      const store = createMockStore([
        { id: 103, status: 'PENDING' },
      ]);

      await engine.applyTransaction(
        [{ id: 103, status: 'COMPLETED' }],
        'id',
        store
      );

      expect(engine.flashMap.has('103:status')).toBe(true);
      const flash = engine.flashMap.get('103:status');
      expect(flash?.type).toBe('neutral');
    });

    it('should not record a flash if value is unchanged', async () => {
      const store = createMockStore([
        { id: 104, symbol: 'MSFT', price: 300.0 },
      ]);

      await engine.applyTransaction(
        [{ id: 104, price: 300.0 }],
        'id',
        store
      );

      expect(engine.flashMap.has('104:price')).toBe(false);
    });

    it('should ignore idField and internal columns starting with double underscore', async () => {
      const store = createMockStore([
        { id: 105, value: 50 },
      ]);

      await engine.applyTransaction(
        [{ id: 105, value: 60, __internalMeta: 'ignored' }],
        'id',
        store
      );

      expect(engine.flashMap.has('105:id')).toBe(false);
      expect(engine.flashMap.has('105:__internalMeta')).toBe(false);
      expect(engine.flashMap.has('105:value')).toBe(true);
    });

    it('should fallback to updateRowFields or setCell when setCellsBatch is not implemented', async () => {
      // 1. Fallback to updateRowFields
      const updateRowFieldsStore = {
        rawData: [{ id: 1, counter: 10 }],
        updateRowFields: vi.fn(),
      } as unknown as IDataStore;

      await engine.applyTransaction([{ id: 1, counter: 15 }], 'id', updateRowFieldsStore);
      expect((updateRowFieldsStore as any).updateRowFields).toHaveBeenCalledWith(1, { id: 1, counter: 15 });

      // 2. Fallback to individual setCell
      const singleSetCellStore = {
        rawData: [{ id: 2, counter: 20 }],
        setCell: vi.fn(),
      } as unknown as IDataStore;

      await engine.applyTransaction([{ id: 2, counter: 25 }], 'id', singleSetCellStore);
      expect(singleSetCellStore.setCell).toHaveBeenCalledWith(2, 'counter', 25);
    });

    it('should resolve old rows via getViewRow when rawData array is not directly exposed', async () => {
      const virtualRowStore = {
        getRowCount: vi.fn(() => 1),
        getViewRow: vi.fn(() => ({
          type: 'data',
          data: { customKey: 'row-1', score: 80 },
        })),
        setCellsBatch: vi.fn(),
      } as unknown as IDataStore;

      await engine.applyTransaction(
        [{ customKey: 'row-1', score: 95 }],
        'customKey',
        virtualRowStore
      );

      expect(engine.flashMap.has('row-1:score')).toBe(true);
      expect(engine.flashMap.get('row-1:score')?.type).toBe('up');
    });
  });

  describe('Fading Opacity & Lifecycle (getFlash & getActiveFlashes)', () => {
    it('should return fading opacity based on elapsed time', () => {
      const now = 1000;
      engine.flashDuration = 600;
      engine.flashMap.set('row1:price', { type: 'up', timestamp: now });

      // Right after flash trigger (elapsed 0ms) -> opacity 1.0
      const flashAtStart = engine.getFlash('row1', 'price', now);
      expect(flashAtStart).toEqual({ type: 'up', opacity: 1 });

      // Halfway through (elapsed 300ms) -> opacity 0.5
      const flashHalfway = engine.getFlash('row1', 'price', now + 300);
      expect(flashHalfway?.opacity).toBeCloseTo(0.5);

      // Flash expired (elapsed 601ms) -> returns null and purges from map
      const flashExpired = engine.getFlash('row1', 'price', now + 601);
      expect(flashExpired).toBeNull();
      expect(engine.flashMap.has('row1:price')).toBe(false);
    });

    it('should return null for un-flashed cell', () => {
      expect(engine.getFlash('nonExistentRow', 'col')).toBeNull();
    });

    it('should purge expired entries when calling getActiveFlashes and hasActiveFlashes', () => {
      const now = 5000;
      engine.flashDuration = 600;
      engine.flashMap.set('active:col', { type: 'up', timestamp: now });
      engine.flashMap.set('expired:col', { type: 'down', timestamp: now - 700 });

      expect(engine.hasActiveFlashes(now)).toBe(true);
      const active = engine.getActiveFlashes(now);
      expect(active.has('active:col')).toBe(true);
      expect(active.has('expired:col')).toBe(false);

      // Advance time past active flash
      expect(engine.hasActiveFlashes(now + 650)).toBe(false);
      expect(engine.getActiveFlashes(now + 650).size).toBe(0);
    });

    it('should clear all flashes on clear()', () => {
      engine.flashMap.set('r1:c1', { type: 'up', timestamp: Date.now() });
      engine.flashMap.set('r2:c2', { type: 'down', timestamp: Date.now() });
      expect(engine.flashMap.size).toBe(2);

      engine.clear();
      expect(engine.flashMap.size).toBe(0);
      expect(engine.hasActiveFlashes()).toBe(false);
    });
  });
});

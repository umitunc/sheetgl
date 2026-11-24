import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerSideRowStore } from '../../src/datagrid/store/ServerSideRowStore';
import { IDatasource, IServerSideGetRowsParams } from '../../src/datagrid/types/ssrm';

describe('ServerSideRowStore', () => {
  let mockDatasource: IDatasource;
  let lastParams: IServerSideGetRowsParams | null = null;

  beforeEach(() => {
    lastParams = null;
    mockDatasource = {
      getRows: vi.fn((params: IServerSideGetRowsParams) => {
        lastParams = params;
      }),
    };
  });

  function createStore(overrides: Partial<any> = {}): ServerSideRowStore {
    return new ServerSideRowStore({
      datasource: mockDatasource,
      blockSize: 50,
      maxBlocksInCache: 10,
      debounceMs: 0, // immediate execution in tests
      keyField: 'id',
      initialRowCount: 200,
      ...overrides,
    });
  }

  describe('Initialization & Configuration', () => {
    it('should initialize with correct block size, row count, and remote flag', () => {
      const store = createStore();
      expect(store.isRemote()).toBe(true);
      expect(store.blockSize).toBe(50);
      expect(store.getRowCount()).toBe(200);
      expect(store.getKeyField()).toBe('id');
      expect(store.getBlockIndex(0)).toBe(0);
      expect(store.getBlockIndex(49)).toBe(0);
      expect(store.getBlockIndex(50)).toBe(1);
    });
  });

  describe('Block Fetching & Data Retrieval', () => {
    it('should return undefined and trigger datasource.getRows when block is not cached', () => {
      const store = createStore();
      const row = store.getRow(10);

      expect(row).toBeUndefined();
      expect(mockDatasource.getRows).toHaveBeenCalled();
      expect(store.isBlockLoading(0)).toBe(true);
    });

    it('should populate block cache on params.success and return cached rows', () => {
      const store = createStore();
      store.getRow(5); // triggers block 0

      expect(lastParams).not.toBeNull();
      const blockData = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
      }));

      // Simulate successful server response
      lastParams!.success(blockData, 500);

      expect(store.isBlockLoading(0)).toBe(false);
      expect(store.hasBlock(0)).toBe(true);
      expect(store.getRowCount()).toBe(500);

      const cachedRow = store.getRow(5);
      expect(cachedRow).toEqual({ id: 5, name: 'User 5' });

      const viewRow = store.getViewRow(5);
      expect(viewRow).toEqual({
        type: 'data',
        rawIndex: 5,
        data: { id: 5, name: 'User 5' },
      });
    });

    it('should handle params.fail and emit error event', () => {
      const store = createStore();
      const errorListener = vi.fn();
      store.on('error', errorListener);

      store.getRow(20);
      expect(lastParams).not.toBeNull();

      lastParams!.fail();

      expect(store.isBlockLoading(0)).toBe(false);
      expect(errorListener).toHaveBeenCalled();
    });

    it('should guard range with ensureRangeLoadedImmediate', () => {
      const store = createStore();

      // Missing blocks -> returns false and queues fetch
      const isLoadedBefore = store.ensureRangeLoadedImmediate(0, 49);
      expect(isLoadedBefore).toBe(false);
      expect(store.isBlockLoading(0)).toBe(true);

      // Fulfill block 0
      lastParams!.success(
        Array.from({ length: 50 }, (_, i) => ({ id: i })),
        200
      );

      const isLoadedAfter = store.ensureRangeLoadedImmediate(0, 49);
      expect(isLoadedAfter).toBe(true);
    });
  });

  describe('Subscription & Listeners Lifecycle', () => {
    it('should notify subscribers when rows are loaded', () => {
      const store = createStore();
      const subscriber = vi.fn();
      const unsubscribe = store.subscribe(subscriber);

      store.getRow(0);
      lastParams!.success([{ id: 0, name: 'First' }], 100);

      expect(subscriber).toHaveBeenCalled();

      // Unsubscribe
      unsubscribe();
      store.getRow(60); // block 1
      if (lastParams) {
        lastParams.success([], 100);
      }
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should manage event listeners via on/off', () => {
      const store = createStore();
      const loadingListener = vi.fn();

      store.on('loading', loadingListener);
      store.getRow(0);

      expect(loadingListener).toHaveBeenCalled();

      store.off('loading', loadingListener);
    });
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolBar, ToolBarProps } from '../../src/datagrid/ui/ToolBar';
import { appleLight } from '../../src/datagrid/theme/presets/appleLight';
import { enUS } from '../../src/datagrid/i18n/locales/enUS';
import { trTR } from '../../src/datagrid/i18n/locales/trTR';
import { ColumnDef } from '../../src/datagrid/types/grid';

describe('ToolBar Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  const sampleColumns: ColumnDef[] = [
    { id: 'id', title: 'ID', type: 'number', width: 60 },
    { id: 'name', title: 'Full Name', type: 'text', width: 140 },
    { id: 'department', title: 'Department', type: 'text', width: 120 },
  ];

  function createProps(overrides: Partial<ToolBarProps> = {}): ToolBarProps {
    return {
      theme: appleLight,
      locale: enUS,
      currentThemeName: 'apple-light',
      onThemeChange: vi.fn(),
      onLocaleChange: vi.fn(),
      searchKeyword: '',
      onSearchChange: vi.fn(),
      onExportCsv: vi.fn(),
      onExportExcel: vi.fn(),
      groups: [],
      onToggleGroupColumn: vi.fn(),
      availableColumns: sampleColumns,
      onAddRow: vi.fn(),
      onDuplicateRow: vi.fn(),
      onDeleteRow: vi.fn(),
      canUndo: true,
      canRedo: true,
      onUndo: vi.fn(),
      onRedo: vi.fn(),
      selectedRowCount: 1,
      ...overrides,
    };
  }

  it('should return null when toolbarConfig.visible is false', () => {
    const props = createProps({
      toolbarConfig: { visible: false },
    });
    const { container } = render(<ToolBar {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render brand logo by default and allow hiding it via showBrand: false', () => {
    const propsWithBrand = createProps();
    const { unmount } = render(<ToolBar {...propsWithBrand} />);
    expect(screen.getByText('Sheet')).toBeDefined();
    expect(screen.getByText('GL')).toBeDefined();

    unmount();

    const propsNoBrand = createProps({
      toolbarConfig: { showBrand: false },
    });
    render(<ToolBar {...propsNoBrand} />);
    expect(screen.queryByText('Sheet')).toBeNull();
  });

  describe('Row Actions & Permissions', () => {
    it('should trigger onAddRow, onDuplicateRow, and onDeleteRow callbacks on click', () => {
      const props = createProps();
      render(<ToolBar {...props} />);

      const addBtn = screen.getByTitle('Insert New Row');
      fireEvent.click(addBtn);
      expect(props.onAddRow).toHaveBeenCalled();

      const dupBtn = screen.getByTitle('Duplicate Selected Row');
      fireEvent.click(dupBtn);
      expect(props.onDuplicateRow).toHaveBeenCalled();

      const delBtn = screen.getByTitle('Delete 1 Selected Rows');
      fireEvent.click(delBtn);
      expect(props.onDeleteRow).toHaveBeenCalled();
    });

    it('should disable add/duplicate/delete buttons when in readonly mode', () => {
      const props = createProps({
        permissions: { mode: 'readonly', allowAdding: false, allowDeleting: false },
      });
      render(<ToolBar {...props} />);

      const addBtn = screen.getByTitle('Insert New Row');
      fireEvent.click(addBtn);
      expect(props.onAddRow).not.toHaveBeenCalled();
    });
  });

  describe('Undo / Redo & Search', () => {
    it('should trigger onUndo and onRedo callbacks', () => {
      const props = createProps({ canUndo: true, canRedo: true });
      render(<ToolBar {...props} />);

      const undoBtn = screen.getByTitle(/Undo/i);
      fireEvent.click(undoBtn);
      expect(props.onUndo).toHaveBeenCalled();

      const redoBtn = screen.getByTitle(/Redo/i);
      fireEvent.click(redoBtn);
      expect(props.onRedo).toHaveBeenCalled();
    });

    it('should trigger onSearchChange when typing in the search input', () => {
      const props = createProps({ searchKeyword: '' });
      render(<ToolBar {...props} />);

      const searchInput = screen.getByPlaceholderText(enUS.searchPlaceholder);
      fireEvent.change(searchInput, { target: { value: 'Engine' } });
      expect(props.onSearchChange).toHaveBeenCalledWith('Engine');
    });
  });

  describe('Export Actions', () => {
    it('should trigger onExportCsv and onExportExcel on button clicks', () => {
      const props = createProps();
      render(<ToolBar {...props} />);

      const csvBtn = screen.getByTitle(enUS.exportCsv || 'Export to CSV');
      fireEvent.click(csvBtn);
      expect(props.onExportCsv).toHaveBeenCalled();

      const excelBtn = screen.getByTitle(enUS.exportExcel || 'Export to Excel');
      fireEvent.click(excelBtn);
      expect(props.onExportExcel).toHaveBeenCalled();
    });
  });

  describe('Batch Actions', () => {
    it('should render batch save, discard, and review buttons when pendingChangesCount > 0', () => {
      const onSaveBatch = vi.fn();
      const onDiscardBatch = vi.fn();
      const onInspectBatchChanges = vi.fn();

      const props = createProps({
        pendingChangesCount: 3,
        onSaveBatch,
        onDiscardBatch,
        onInspectBatchChanges,
      });
      render(<ToolBar {...props} />);

      // Review changes button (contains "3 Unsaved")
      const reviewBtn = screen.getByText('3 Unsaved');
      fireEvent.click(reviewBtn);
      expect(onInspectBatchChanges).toHaveBeenCalled();

      // Save button ("Batch Save")
      const saveBtn = screen.getByTitle('Batch Save Changes');
      fireEvent.click(saveBtn);
      expect(onSaveBatch).toHaveBeenCalled();

      // Discard button ("Discard")
      const discardBtn = screen.getByTitle('Discard Changes');
      fireEvent.click(discardBtn);
      expect(onDiscardBatch).toHaveBeenCalled();
    });
  });

  describe('Clear Filters Indicator', () => {
    it('should render active filter count badge and clear button when activeFilterCount > 0', () => {
      const onClearAllFilters = vi.fn();
      const props = createProps({
        activeFilterCount: 2,
        onClearAllFilters,
      });
      render(<ToolBar {...props} />);

      const clearBtn = screen.getByTitle('Clear all active filters');
      fireEvent.click(clearBtn);
      expect(onClearAllFilters).toHaveBeenCalled();
    });
  });

  describe('Button Display Modes', () => {
    it('should render text labels in "text" display mode', () => {
      const props = createProps({
        toolbarConfig: { buttonDisplayMode: 'text' },
      });
      render(<ToolBar {...props} />);
      expect(screen.getByText('Add Row')).toBeDefined();
    });

    it('should render both icon and text in "icon-text" display mode', () => {
      const props = createProps({
        toolbarConfig: { buttonDisplayMode: 'icon-text' },
      });
      render(<ToolBar {...props} />);
      expect(screen.getByText('Add Row')).toBeDefined();
    });
  });

  describe('Custom Toolbar Items', () => {
    it('should render custom action items and handle clicks', () => {
      const customAction = vi.fn();
      const props = createProps({
        toolbarConfig: {
          customItems: [
            {
              id: 'sync-db',
              label: 'Sync Database',
              icon: 'sync',
              onClick: customAction,
              variant: 'primary',
            },
          ],
        },
      });
      render(<ToolBar {...props} />);

      const customBtn = screen.getByText('Sync Database');
      fireEvent.click(customBtn);
      expect(customAction).toHaveBeenCalled();
    });
  });

  describe('Localization Support', () => {
    it('should render Turkish labels when locale is trTR', () => {
      const props = createProps({
        locale: trTR,
      });
      render(<ToolBar {...props} />);
      expect(screen.getByText('Satır Ekle')).toBeDefined();
      expect(screen.getByPlaceholderText(trTR.searchPlaceholder)).toBeDefined();
    });
  });
});

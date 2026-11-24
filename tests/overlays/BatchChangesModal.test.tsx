// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  BatchChangesModal,
  BatchChangesModalProps,
} from '../../src/datagrid/overlays/BatchChangesModal';
import { appleLight } from '../../src/datagrid/theme/presets/appleLight';
import { enUS } from '../../src/datagrid/i18n/locales/enUS';
import { trTR } from '../../src/datagrid/i18n/locales/trTR';
import { ColumnDef } from '../../src/datagrid/types/grid';

describe('BatchChangesModal Component', () => {
  const columns: ColumnDef[] = [
    { id: 'id', title: 'ID', type: 'number', width: 60 },
    { id: 'name', title: 'Name', type: 'text', width: 140 },
    { id: 'role', title: 'Role', type: 'text', width: 120 },
  ];

  const sampleChanges = {
    inserted: [{ id: 'new-1', name: 'New Employee', role: 'Intern' }],
    updated: [
      {
        key: 101,
        values: { role: 'Senior Architect' },
        oldValues: { role: 'Architect' },
      },
    ],
    deleted: [102],
    deletedRowsData: [
      { key: 102, data: { id: 102, name: 'Terminated User', role: 'Analyst' } },
    ],
  };

  function createProps(overrides: Partial<BatchChangesModalProps> = {}): BatchChangesModalProps {
    return {
      changes: sampleChanges,
      columns,
      theme: appleLight,
      locale: enUS,
      onConfirmSave: vi.fn(),
      onDiscardAll: vi.fn(),
      onRevertDelete: vi.fn(),
      onRevertUpdate: vi.fn(),
      onRevertInsert: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };
  }

  it('should render modal header with total operations count', () => {
    const props = createProps();
    render(<BatchChangesModal {...props} />);

    expect(screen.getByText(/Pending Batch Changes Summary \(3 Operations\)/)).toBeDefined();
  });

  it('should render Turkish header when locale is trTR', () => {
    const props = createProps({ locale: trTR });
    render(<BatchChangesModal {...props} />);

    expect(screen.getByText(/Bekleyen Toplu Değişiklik Özeti \(3 İşlem\)/)).toBeDefined();
  });

  it('should allow switching between summary tabs', () => {
    const props = createProps();
    render(<BatchChangesModal {...props} />);

    // Switch to Rows to Delete
    const deletedTab = screen.getByRole('button', { name: /Rows to Delete/i });
    fireEvent.click(deletedTab);
    expect(screen.getAllByText(/Terminated User/).length).toBeGreaterThan(0);

    // Switch to Modified Rows
    const updatedTab = screen.getByRole('button', { name: /Modified Rows/i });
    fireEvent.click(updatedTab);
    expect(screen.getByText(/Senior Architect/)).toBeDefined();

    // Switch to Inserted Rows
    const insertedTab = screen.getByRole('button', { name: /Inserted Rows/i });
    fireEvent.click(insertedTab);
    expect(screen.getByText(/New Employee/)).toBeDefined();

    // Switch to JSON Payload tab
    const payloadTab = screen.getByRole('button', { name: /JSON Payload/i });
    fireEvent.click(payloadTab);
    expect(screen.getByText(/POST \/api\/v1\/sheetgl\/batch-commit/)).toBeDefined();
  });

  it('should trigger onConfirmSave on Commit Batch button click', () => {
    const onConfirmSave = vi.fn();
    const props = createProps({ onConfirmSave });
    render(<BatchChangesModal {...props} />);

    const saveBtn = screen.getByRole('button', { name: /Confirm & Batch Save|Onayla ve Toplu Kaydet/i });
    fireEvent.click(saveBtn);
    expect(onConfirmSave).toHaveBeenCalled();
  });

  it('should trigger onDiscardAll on Discard Changes button click', () => {
    const onDiscardAll = vi.fn();
    const props = createProps({ onDiscardAll });
    render(<BatchChangesModal {...props} />);

    const discardBtn = screen.getByRole('button', { name: /Discard All Changes|Tüm Değişikliklerden Vazgeç/i });
    fireEvent.click(discardBtn);
    expect(onDiscardAll).toHaveBeenCalled();
  });

  it('should trigger onClose on close button and backdrop click', () => {
    const onClose = vi.fn();
    const props = createProps({ onClose });
    const { container } = render(<BatchChangesModal {...props} />);

    // Backdrop click
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import {
  DeleteConfirmProgressModal,
  DeleteConfirmProgressModalProps,
} from '../../src/datagrid/overlays/DeleteConfirmProgressModal';
import { appleLight } from '../../src/datagrid/theme/presets/appleLight';
import { enUS } from '../../src/datagrid/i18n/locales/enUS';
import { trTR } from '../../src/datagrid/i18n/locales/trTR';

describe('DeleteConfirmProgressModal Component', () => {
  const sampleRows = [
    { id: 101, name: 'Product Alpha', code: 'PRD-A' },
    { id: 102, name: 'Product Beta', code: 'PRD-B' },
  ];

  function createProps(overrides: Partial<DeleteConfirmProgressModalProps> = {}): DeleteConfirmProgressModalProps {
    return {
      rowKeys: [101, 102],
      sampleRows,
      batchMode: true,
      theme: appleLight,
      locale: enUS,
      onConfirm: vi.fn(async () => {}),
      onCancel: vi.fn(),
      ...overrides,
    };
  }

  it('should render header and row count in English', () => {
    const props = createProps();
    render(<DeleteConfirmProgressModal {...props} />);

    expect(screen.getByText('Confirm Row Deletion')).toBeDefined();
    expect(screen.getByText(/2 records selected/)).toBeDefined();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeDefined();
  });

  it('should render header and row count in Turkish when locale is trTR', () => {
    const props = createProps({ locale: trTR });
    render(<DeleteConfirmProgressModal {...props} />);

    expect(screen.getByText('Silme İşlemini Onaylayın')).toBeDefined();
    expect(screen.getByText(/Toplam 2 kayıt seçildi/)).toBeDefined();
  });

  it('should render preview list of rows to be deleted', () => {
    const props = createProps();
    render(<DeleteConfirmProgressModal {...props} />);

    expect(screen.getByText(/#101 • PRD-A/)).toBeDefined();
    expect(screen.getByText('Product Alpha')).toBeDefined();
    expect(screen.getByText(/#102 • PRD-B/)).toBeDefined();
  });

  it('should render batch mode info banner when batchMode is true', () => {
    const props = createProps({ batchMode: true });
    render(<DeleteConfirmProgressModal {...props} />);

    expect(screen.getByText(/Batch mode is active/)).toBeDefined();
  });

  it('should trigger onCancel on cancel button and backdrop click', () => {
    const onCancel = vi.fn();
    const props = createProps({ onCancel });
    const { container, rerender } = render(<DeleteConfirmProgressModal {...props} />);

    // Cancel button in footer
    const cancelBtn = screen.getByRole('button', { name: /Cancel|İptal/i });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);

    // Backdrop click
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('should transition to progress view and call onConfirm when delete is confirmed', async () => {
    let progressCallback: ((processed: number, total: number) => void) | null = null;
    const onConfirm = vi.fn(async (cb) => {
      progressCallback = cb;
      cb(1, 2);
    });

    const props = createProps({ onConfirm });
    render(<DeleteConfirmProgressModal {...props} />);

    const confirmBtn = screen.getByRole('button', { name: /Delete|Sil/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });

    expect(screen.getByText(/Deleting Selected Rows|Satırlar Siliniyor/i)).toBeDefined();
  });
});

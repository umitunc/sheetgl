// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  SparklineModalOverlay,
  SparklineModalOverlayProps,
} from '../../src/datagrid/overlays/SparklineModalOverlay';
import { appleLight } from '../../src/datagrid/theme/presets/appleLight';
import { enUS } from '../../src/datagrid/i18n/locales/enUS';
import { trTR } from '../../src/datagrid/i18n/locales/trTR';

describe('SparklineModalOverlay Component', () => {
  function createProps(overrides: Partial<SparklineModalOverlayProps> = {}): SparklineModalOverlayProps {
    return {
      modal: {
        rowIndex: 2,
        rowData: { id: 103, company: 'Acme Corp', code: 'ACM-01' },
        column: { id: 'trend', title: 'Revenue Trend', type: 'sparkline', width: 120 },
        points: [10, 25, 18, 42, 60],
      },
      theme: appleLight,
      locale: enUS,
      onClose: vi.fn(),
      ...overrides,
    };
  }

  it('should render modal header with column title and row company name', () => {
    const props = createProps();
    render(<SparklineModalOverlay {...props} />);

    expect(screen.getByText(/Revenue Trend/)).toBeDefined();
    expect(screen.getByText('Acme Corp')).toBeDefined();
    expect(screen.getByText(/ACM-01/)).toBeDefined();
  });

  it('should switch between area line and bar chart types', () => {
    const props = createProps();
    render(<SparklineModalOverlay {...props} />);

    const barBtn = screen.getByRole('button', { name: /Bar Chart|Sütun/i });
    fireEvent.click(barBtn);

    const areaBtn = screen.getByRole('button', { name: /Area Line|Çizgi/i });
    fireEvent.click(areaBtn);
  });

  it('should trigger onClose on close button click, backdrop click, and Escape key', () => {
    const onClose = vi.fn();
    const props = createProps({ onClose });
    const { container } = render(<SparklineModalOverlay {...props} />);

    // 1. Close button (✕)
    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // 2. Backdrop click
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);

    // 3. Escape key press
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('should handle empty or null points gracefully with fallback', () => {
    const props = createProps({
      modal: {
        rowIndex: 0,
        rowData: { id: 1 },
        column: { id: 'trend', title: 'Trend', type: 'sparkline', width: 100 },
        points: [],
      },
    });

    expect(() => render(<SparklineModalOverlay {...props} />)).not.toThrow();
  });
});

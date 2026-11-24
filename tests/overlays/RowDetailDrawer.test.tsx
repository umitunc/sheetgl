// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RowDetailDrawer, RowDetailDrawerProps } from '../../src/datagrid/overlays/RowDetailDrawer';
import { appleLight } from '../../src/datagrid/theme/presets/appleLight';
import { enUS } from '../../src/datagrid/i18n/locales/enUS';
import { trTR } from '../../src/datagrid/i18n/locales/trTR';

describe('RowDetailDrawer Component', () => {
  const sampleRow = {
    id: 101,
    name: 'Alice Smith',
    role: 'Lead Architect',
    salary: 125000,
  };

  function createProps(overrides: Partial<RowDetailDrawerProps> = {}): RowDetailDrawerProps {
    return {
      config: { enabled: true },
      rowIndex: 0,
      rowKey: 101,
      rowData: sampleRow,
      theme: appleLight,
      locale: enUS,
      onClose: vi.fn(),
      ...overrides,
    };
  }

  it('should render default title and row metadata in English', () => {
    const props = createProps();
    render(<RowDetailDrawer {...props} />);

    expect(screen.getByText('Row Details (Row #1)')).toBeDefined();
    expect(screen.getByText(/Key: 101 • Index: #1/)).toBeDefined();
  });

  it('should render default title in Turkish when locale is trTR', () => {
    const props = createProps({ locale: trTR });
    render(<RowDetailDrawer {...props} />);

    expect(screen.getByText('Satır Detayı (Row #1)')).toBeDefined();
  });

  it('should support static custom title string and dynamic title function', () => {
    // 1. Static custom title string
    const staticProps = createProps({
      config: { title: 'Employee Overview' },
    });
    const { unmount } = render(<RowDetailDrawer {...staticProps} />);
    expect(screen.getByText('Employee Overview')).toBeDefined();
    unmount();

    // 2. Dynamic title function
    const dynamicProps = createProps({
      config: {
        title: (data) => `Profile: ${data.name} (${data.role})`,
      },
    });
    render(<RowDetailDrawer {...dynamicProps} />);
    expect(screen.getByText('Profile: Alice Smith (Lead Architect)')).toBeDefined();
  });

  it('should render default key-value field list when no custom template is provided', () => {
    const props = createProps();
    render(<RowDetailDrawer {...props} />);

    expect(screen.getByText('name:')).toBeDefined();
    expect(screen.getByText('Alice Smith')).toBeDefined();
    expect(screen.getByText('role:')).toBeDefined();
    expect(screen.getByText('Lead Architect')).toBeDefined();
  });

  it('should render custom template when provided in config', () => {
    const customTemplate = vi.fn(({ rowData, onClose }) => (
      <div data-testid="custom-panel">
        <h3>Custom Card for {rowData.name}</h3>
        <button onClick={onClose}>Dismiss</button>
      </div>
    ));

    const props = createProps({
      config: { template: customTemplate },
    });
    render(<RowDetailDrawer {...props} />);

    expect(screen.getByTestId('custom-panel')).toBeDefined();
    expect(screen.getByText('Custom Card for Alice Smith')).toBeDefined();
    expect(customTemplate).toHaveBeenCalled();
  });

  it('should trigger onClose on close button click', () => {
    const onClose = vi.fn();
    const props = createProps({ onClose });
    render(<RowDetailDrawer {...props} />);

    const closeBtn = screen.getByTitle('Close (Esc)');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('should trigger onClose on backdrop click', () => {
    const onClose = vi.fn();
    const props = createProps({ onClose });
    const { container } = render(<RowDetailDrawer {...props} />);

    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('should trigger onClose on Escape key press', () => {
    const onClose = vi.fn();
    const props = createProps({ onClose });
    render(<RowDetailDrawer {...props} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

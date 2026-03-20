import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

function createFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

describe('FileUpload', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders dropzone variant by default', () => {
    render(<FileUpload label="Upload" />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('renders button variant', () => {
    render(<FileUpload label="Upload" variant="button" />);
    expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<FileUpload label="Attachment" />);
    expect(screen.getByText('Attachment')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<FileUpload label="Upload" description="PNG, JPG up to 10MB" />);
    expect(screen.getByText('PNG, JPG up to 10MB')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<FileUpload label="Upload" variant="button" disabled />);
    expect(screen.getByRole('button', { name: /choose file/i })).toBeDisabled();
  });

  // ─── File selection ─────────────────────────────────────────────────
  it('calls onChange when files are selected', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload label="Upload" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile('test.txt', 100, 'text/plain');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
  });

  it('shows file list after selection', async () => {
    const { container } = render(<FileUpload label="Upload" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile('document.pdf', 5000, 'application/pdf');
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('removes file when remove button is clicked', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload label="Upload" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile('test.txt', 100, 'text/plain');
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Remove test.txt'));
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  // ─── Validation ─────────────────────────────────────────────────────
  it('calls onError for files exceeding maxSize', () => {
    const onError = vi.fn();
    const { container } = render(<FileUpload label="Upload" maxSize={1000} onError={onError} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile('big.txt', 2000, 'text/plain');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onError).toHaveBeenCalled();
  });

  // ─── Multiple ───────────────────────────────────────────────────────
  it('supports multiple files', () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload label="Upload" multiple onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
  });

  // ─── Drag and drop ──────────────────────────────────────────────────
  it('highlights on drag over', () => {
    const { container } = render(<FileUpload label="Upload" />);
    const dropzone = container.querySelector('[role="button"]') as HTMLElement;
    fireEvent.dragOver(dropzone, { preventDefault: () => {} });
    expect(dropzone.className).toContain('dropzoneActive');
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<FileUpload ref={ref} label="Upload" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<FileUpload label="Upload" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('dropzone has role="button"', () => {
    render(<FileUpload label="Upload" />);
    expect(screen.getByRole('button', { name: /dropzone/i })).toBeInTheDocument();
  });

  it('dropzone is keyboard accessible', async () => {
    render(<FileUpload label="Upload" />);
    const dropzone = screen.getByRole('button', { name: /dropzone/i });
    dropzone.focus();
    expect(document.activeElement).toBe(dropzone);
  });

  it('passes axe accessibility checks (dropzone)', async () => {
    const { container } = render(<FileUpload label="Upload" description="PNG up to 5MB" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks (button)', async () => {
    const { container } = render(<FileUpload label="Upload" variant="button" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockReset();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders when open is true', () => {
    render(
      <BottomSheet open onClose={onClose}>
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <BottomSheet open={false} onClose={onClose}>
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <BottomSheet open onClose={onClose} title="Sheet Title" description="Sheet description">
        <p>Content</p>
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet description')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(
      <BottomSheet open onClose={onClose}>
        <p>Content</p>
      </BottomSheet>,
    );
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when sheet itself is clicked', () => {
    render(
      <BottomSheet open onClose={onClose}>
        <p>Content</p>
      </BottomSheet>,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    render(
      <BottomSheet open onClose={onClose}>
        <p>Content</p>
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when dismissible is false', () => {
    render(
      <BottomSheet open onClose={onClose} dismissible={false}>
        <p>Content</p>
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders handle bar when showHandle is true', () => {
    const { container } = render(
      <BottomSheet open onClose={onClose} showHandle>
        <p>Content</p>
      </BottomSheet>,
    );
    const handle = container.querySelector('[class*="handleBar"]');
    expect(handle).toBeInTheDocument();
  });

  it('does not render handle bar when showHandle is false', () => {
    const { container } = render(
      <BottomSheet open onClose={onClose} showHandle={false}>
        <p>Content</p>
      </BottomSheet>,
    );
    const handle = container.querySelector('[class*="handleBar"]');
    expect(handle).not.toBeInTheDocument();
  });

  it('has aria-modal and role="dialog"', () => {
    render(
      <BottomSheet open onClose={onClose}>
        <p>Content</p>
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby when title is provided', () => {
    render(
      <BottomSheet open onClose={onClose} title="My Title">
        <p>Content</p>
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    const labelId = dialog.getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelId)?.textContent).toBe('My Title');
  });

  it('locks body scroll when open', () => {
    const { unmount } = render(
      <BottomSheet open onClose={onClose}>
        <p>Content</p>
      </BottomSheet>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
  });

  it('supports className passthrough', () => {
    render(
      <BottomSheet open onClose={onClose} className="custom-class">
        <p>Content</p>
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog').className).toContain('custom-class');
  });

  it('renders close button with title', () => {
    render(
      <BottomSheet open onClose={onClose} title="Title">
        <p>Content</p>
      </BottomSheet>,
    );
    const closeBtn = screen.getByLabelText('Close');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus inside the sheet', async () => {
    const user = userEvent.setup();
    render(
      <BottomSheet open onClose={onClose} title="Title">
        <button type="button">First</button>
        <button type="button">Last</button>
      </BottomSheet>,
    );

    // Focus should be inside the dialog
    const closeBtn = screen.getByLabelText('Close');
    const lastBtn = screen.getByText('Last');

    // Tab from last back to first (close button is first focusable)
    lastBtn.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeBtn);
  });
});

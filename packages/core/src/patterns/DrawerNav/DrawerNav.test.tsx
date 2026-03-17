import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DrawerNav } from './DrawerNav';

describe('DrawerNav', () => {
  const onClose = vi.fn();

  afterEach(() => {
    onClose.mockReset();
    document.body.style.overflow = '';
  });

  it('renders when open is true', () => {
    render(
      <DrawerNav open onClose={onClose}>
        <p>Nav content</p>
      </DrawerNav>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Nav content')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <DrawerNav open={false} onClose={onClose}>
        <p>Nav content</p>
      </DrawerNav>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title in header', () => {
    render(
      <DrawerNav open onClose={onClose} title="Menu">
        <p>Content</p>
      </DrawerNav>,
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('slides from left by default', () => {
    render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('left');
  });

  it('slides from right when side="right"', () => {
    render(
      <DrawerNav open onClose={onClose} side="right">
        <p>Content</p>
      </DrawerNav>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('right');
  });

  it('calls onClose when overlay is clicked', () => {
    const { container } = render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    const overlay = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has aria-modal and role="dialog"', () => {
    render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('locks body scroll when open', () => {
    const { unmount } = render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <DrawerNav open={false} onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('does not render overlay when overlay={false}', () => {
    const { container } = render(
      <DrawerNav open onClose={onClose} overlay={false}>
        <p>Content</p>
      </DrawerNav>,
    );
    const overlayEl = container.querySelector('div[aria-hidden="true"]');
    expect(overlayEl).not.toBeInTheDocument();
  });

  it('supports className passthrough', () => {
    render(
      <DrawerNav open onClose={onClose} className="custom-drawer">
        <p>Content</p>
      </DrawerNav>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-drawer');
  });

  it('renders close button', () => {
    render(
      <DrawerNav open onClose={onClose}>
        <p>Content</p>
      </DrawerNav>,
    );
    const closeBtn = screen.getByLabelText('Close drawer');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus inside the drawer', async () => {
    const user = userEvent.setup();
    render(
      <DrawerNav open onClose={onClose} title="Menu">
        <button type="button">First</button>
        <button type="button">Last</button>
      </DrawerNav>,
    );
    const lastBtn = screen.getByText('Last');
    const closeBtn = screen.getByLabelText('Close drawer');

    lastBtn.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeBtn);
  });

  it('supports custom width', () => {
    render(
      <DrawerNav open onClose={onClose} width="300px">
        <p>Content</p>
      </DrawerNav>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.style.width).toBe('300px');
  });
});

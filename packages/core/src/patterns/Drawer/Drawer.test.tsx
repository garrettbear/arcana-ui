import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders when open', () => {
    render(<Drawer open onClose={vi.fn()} title="Settings" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Drawer open={false} onClose={vi.fn()} title="Settings" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Drawer open onClose={vi.fn()} title="Drawer Title" />);
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Drawer open onClose={vi.fn()} title="Settings" description="Configure options" />);
    expect(screen.getByText('Configure options')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Drawer open onClose={vi.fn()} footer={<button type="button">Save</button>}>
        Content
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  // ─── Close behavior ────────────────────────────────────────────────
  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Test" />);
    await userEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Test" />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when closeOnEsc is false', () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} closeOnEsc={false} title="Test" />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('hides close button when showClose is false', () => {
    render(<Drawer open onClose={vi.fn()} title="Test" showClose={false} />);
    expect(screen.queryByLabelText('Close drawer')).not.toBeInTheDocument();
  });

  // ─── Body scroll lock ──────────────────────────────────────────────
  it('locks body scroll when open', () => {
    render(<Drawer open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Drawer open onClose={vi.fn()} />);
    rerender(<Drawer open={false} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('');
  });

  // ─── Sides ─────────────────────────────────────────────────────────
  it('renders left side variant', () => {
    const { container } = render(<Drawer open onClose={vi.fn()} side="left" />);
    expect(container.querySelector('[class*="side-left"]')).toBeInTheDocument();
  });

  it('renders bottom side variant', () => {
    const { container } = render(<Drawer open onClose={vi.fn()} side="bottom" />);
    expect(container.querySelector('[class*="side-bottom"]')).toBeInTheDocument();
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Drawer ref={ref} open onClose={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className to drawer panel', () => {
    render(<Drawer open onClose={vi.fn()} className="custom" />);
    expect(screen.getByRole('dialog')).toHaveClass('custom');
  });

  // ─── ARIA ──────────────────────────────────────────────────────────
  it('has aria-modal', () => {
    render(<Drawer open onClose={vi.fn()} title="Test" />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to title', () => {
    render(<Drawer open onClose={vi.fn()} title="Test" />);
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Test');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Drawer open onClose={vi.fn()} title="Settings">
        <p>Content</p>
      </Drawer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with footer', async () => {
    const { container } = render(
      <Drawer open onClose={vi.fn()} title="Edit" footer={<button type="button">Save</button>}>
        <p>Form content</p>
      </Drawer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';
import type { CommandItem } from './CommandPalette';

const items: CommandItem[] = [
  { id: '1', label: 'Go to Dashboard', group: 'Navigation', shortcut: '⌘D' },
  { id: '2', label: 'Go to Settings', group: 'Navigation', shortcut: '⌘,' },
  { id: '3', label: 'Create Project', group: 'Actions', shortcut: '⌘N' },
  { id: '4', label: 'Delete Item', group: 'Actions', disabled: true },
  { id: '5', label: 'Search Users', description: 'Find team members' },
];

describe('CommandPalette', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders when open', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CommandPalette open={false} onClose={vi.fn()} items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument();
  });

  it('renders all items', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('renders grouped items with headers', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders item shortcuts', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByText('⌘D')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByText('Find team members')).toBeInTheDocument();
  });

  // ─── Search / Filtering ─────────────────────────────────────────────
  it('filters items based on search query', async () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    const input = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.change(input, { target: { value: 'Dashboard' } });
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    const input = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows custom empty state', async () => {
    render(
      <CommandPalette open onClose={vi.fn()} items={items} emptyState={<p>Nothing here</p>} />,
    );
    const input = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  // ─── Selection ──────────────────────────────────────────────────────
  it('calls onSelect when item is clicked', async () => {
    const onSelect = vi.fn();
    render(<CommandPalette open onClose={vi.fn()} items={items} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Go to Dashboard'));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it('calls onClose after selection', async () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items} />);
    await userEvent.click(screen.getByText('Go to Dashboard'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not select disabled items', async () => {
    const onSelect = vi.fn();
    render(<CommandPalette open onClose={vi.fn()} items={items} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Delete Item'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ─── Keyboard Navigation ───────────────────────────────────────────
  it('selects item with Enter key', () => {
    const onSelect = vi.fn();
    render(<CommandPalette open onClose={vi.fn()} items={items} onSelect={onSelect} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  // ─── Body scroll lock ──────────────────────────────────────────────
  it('locks body scroll when open', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CommandPalette ref={ref} open onClose={vi.fn()} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} className="custom" />);
    expect(screen.getByRole('dialog')).toHaveClass('custom');
  });

  // ─── ARIA ──────────────────────────────────────────────────────────
  it('has aria-label', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Command palette');
  });

  it('has aria-modal', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has combobox role on input', () => {
    render(<CommandPalette open onClose={vi.fn()} items={items} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(<CommandPalette open onClose={vi.fn()} items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

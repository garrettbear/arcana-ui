import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover trigger={<button type="button">Open</button>} content={<p>Popover content</p>} />,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(
      <Popover trigger={<button type="button">Open</button>} content={<p>Popover content</p>} />,
    );
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('shows content on click', async () => {
    render(
      <Popover trigger={<button type="button">Open</button>} content={<p>Popover content</p>} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes on second click (toggle)', async () => {
    render(
      <Popover trigger={<button type="button">Open</button>} content={<p>Popover content</p>} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('shows content when defaultOpen is true', () => {
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<p>Popover content</p>}
        defaultOpen
      />,
    );
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const { rerender } = render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<p>Content</p>}
        open={false}
      />,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    rerender(
      <Popover trigger={<button type="button">Open</button>} content={<p>Content</p>} open />,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onOpenChange', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<p>Content</p>}
        onOpenChange={onOpenChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('closes on Escape', async () => {
    render(<Popover trigger={<button type="button">Open</button>} content={<p>Content</p>} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('has aria-expanded on trigger button', async () => {
    render(<Popover trigger={<button type="button">Open</button>} content={<p>Content</p>} />);
    const btn = screen.getByRole('button', { name: 'Open' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Popover ref={ref} trigger={<button type="button">Open</button>} content={<p>Content</p>} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Popover trigger={<button type="button">Open menu</button>} content={<p>Menu content</p>} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with content open', async () => {
    const { container } = render(
      <Popover
        trigger={<button type="button">Open menu</button>}
        content={<p>Menu content</p>}
        defaultOpen
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

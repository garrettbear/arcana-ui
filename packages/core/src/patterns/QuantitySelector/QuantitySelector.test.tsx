import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QuantitySelector } from './QuantitySelector';

describe('QuantitySelector', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders the current value', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} />);
    const input = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(input).toHaveValue('3');
  });

  // ─── Increment ────────────────────────────────────────────────────
  it('increments value when plus button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={5} onChange={onChange} />);
    await user.click(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  // ─── Decrement ────────────────────────────────────────────────────
  it('decrements value when minus button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={5} onChange={onChange} />);
    await user.click(screen.getByLabelText('Decrease quantity'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  // ─── Min limit ────────────────────────────────────────────────────
  it('disables minus button at min value', () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} min={1} />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
  });

  // ─── Max limit ────────────────────────────────────────────────────
  it('disables plus button at max value', () => {
    render(<QuantitySelector value={99} onChange={vi.fn()} max={99} />);
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
  });

  // ─── Disabled ─────────────────────────────────────────────────────
  it('disables all controls when disabled', () => {
    render(<QuantitySelector value={5} onChange={vi.fn()} disabled />);
    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toBeDisabled();
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
  });

  // ─── Direct input ────────────────────────────────────────────────
  it('accepts direct input and clamps on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={5} onChange={onChange} min={1} max={10} />);
    const input = screen.getByRole('spinbutton', { name: /quantity/i });
    await user.clear(input);
    await user.type(input, '15');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('reverts invalid input on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={5} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: /quantity/i });
    await user.clear(input);
    await user.type(input, 'abc');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('5');
  });

  // ─── ARIA ─────────────────────────────────────────────────────────
  it('has correct aria attributes on input', () => {
    render(<QuantitySelector value={3} onChange={vi.fn()} min={1} max={10} />);
    const input = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input).toHaveAttribute('aria-valuenow', '3');
  });

  // ─── Ref & className ─────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<QuantitySelector ref={ref} value={1} onChange={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(
      <QuantitySelector value={1} onChange={vi.fn()} className="custom" />,
    );
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(<QuantitySelector value={3} onChange={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

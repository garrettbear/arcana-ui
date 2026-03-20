import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders input with placeholder', () => {
    render(<DatePicker label="Date" />);
    expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<DatePicker label="Start Date" />);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<DatePicker label="Date" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<DatePicker label="Date" helperText="Pick a date" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<DatePicker label="Date" disabled />);
    expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeDisabled();
  });

  // ─── Calendar ───────────────────────────────────────────────────────
  it('opens calendar on input focus', async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
  });

  it('opens calendar on calendar button click', async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByLabelText('Open calendar'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes calendar on Escape', async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects date from calendar', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" onChange={onChange} />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    // Click day 15 in the calendar
    const day15 = screen.getByRole('button', { name: '15' });
    await userEvent.click(day15);
    expect(onChange).toHaveBeenCalledTimes(1);
    const selectedDate = onChange.mock.calls[0][0] as Date;
    expect(selectedDate.getDate()).toBe(15);
  });

  it('navigates to next month', async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    const monthText = screen.getByText(/\w+ \d{4}/);
    const initialText = monthText.textContent;
    await userEvent.click(screen.getByLabelText('Next month'));
    expect(monthText.textContent).not.toBe(initialText);
  });

  it('navigates to previous month', async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    const monthText = screen.getByText(/\w+ \d{4}/);
    const initialText = monthText.textContent;
    await userEvent.click(screen.getByLabelText('Previous month'));
    expect(monthText.textContent).not.toBe(initialText);
  });

  // ─── Controlled value ──────────────────────────────────────────────
  it('displays controlled value in input', () => {
    const date = new Date(2026, 2, 15); // March 15, 2026
    render(<DatePicker label="Date" value={date} />);
    expect(screen.getByDisplayValue('03/15/2026')).toBeInTheDocument();
  });

  // ─── Clearable ──────────────────────────────────────────────────────
  it('shows clear button when clearable and has value', () => {
    render(<DatePicker label="Date" value={new Date()} clearable />);
    expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
  });

  it('clears date on clear button click', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" value={new Date()} clearable onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Clear date'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  // ─── Min/Max ────────────────────────────────────────────────────────
  it('disables dates outside min/max range', async () => {
    const min = new Date(2026, 2, 10);
    const max = new Date(2026, 2, 20);
    render(<DatePicker label="Date" value={new Date(2026, 2, 15)} min={min} max={max} />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    const day5 = screen.getByRole('button', { name: '5' });
    expect(day5).toBeDisabled();
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DatePicker ref={ref} label="Date" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<DatePicker label="Date" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('has aria-invalid when error', () => {
    render(<DatePicker label="Date" error="Required" />);
    expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveAttribute('aria-invalid', 'true');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<DatePicker label="Date" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with calendar open', async () => {
    const { container } = render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByPlaceholderText('MM/DD/YYYY'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

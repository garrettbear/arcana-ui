import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FontPicker } from './FontPicker';

describe('FontPicker', () => {
  it('renders trigger with current font name', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} />);
    expect(screen.getByText('Inter')).toBeDefined();
  });

  it('opens dropdown on click', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} />);
    const trigger = screen.getByRole('button', { expanded: false });
    fireEvent.click(trigger);
    // Dropdown should be visible (search input present)
    expect(screen.getByPlaceholderText(/search fonts/i)).toBeDefined();
  });

  it('shows category headers', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByText('Sans-Serif')).toBeDefined();
    expect(screen.getByText('Serif')).toBeDefined();
    expect(screen.getByText('Monospace')).toBeDefined();
  });

  it('filters fonts by search query', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    const searchInput = screen.getByPlaceholderText(/search fonts/i);
    fireEvent.change(searchInput, { target: { value: 'Playfair' } });
    expect(screen.getByText('Playfair Display')).toBeDefined();
    // 'Inter' should not be in the dropdown options (may still appear in trigger)
    const buttons = screen.queryAllByRole('button');
    const interInDropdown = buttons.find(
      (b) => b.textContent === 'Inter' && b.getAttribute('aria-pressed'),
    );
    expect(interInDropdown).toBeUndefined();
  });

  it('calls onChange when a font is selected', () => {
    const onChange = vi.fn();
    render(<FontPicker value="'Inter', sans-serif" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Roboto'));
    expect(onChange).toHaveBeenCalledWith("'Roboto', sans-serif");
  });

  it('shows label when provided', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} label="Display" />);
    expect(screen.getByText('Display')).toBeDefined();
  });

  it('disables trigger when disabled', () => {
    render(<FontPicker value="'Inter', sans-serif" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('button')).toHaveProperty('disabled', true);
  });

  it('shows local fonts in Uploaded section', () => {
    render(
      <FontPicker
        value="'Custom', sans-serif"
        onChange={vi.fn()}
        localFonts={[{ name: 'Custom', stack: "'Custom', sans-serif" }]}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Uploaded')).toBeDefined();
    expect(screen.getByText('local')).toBeDefined();
  });
});

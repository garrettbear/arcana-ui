import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders a trigger swatch', () => {
    render(<ColorPicker value="#ff0000" onChange={vi.fn()} />);
    const swatch = screen.getByRole('button', { name: /color picker/i });
    expect(swatch).toBeDefined();
    expect(swatch.style.background).toBeTruthy();
  });

  it('opens popup on click and shows canvas', () => {
    render(<ColorPicker value="#00ff00" onChange={vi.fn()} />);
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    // Canvas should be present
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('shows hex input in popup', () => {
    render(<ColorPicker value="#3366cc" onChange={vi.fn()} />);
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    const hexInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    expect(hexInput).toBeTruthy();
    expect(hexInput.value).toContain('#');
  });

  it('disables the trigger when disabled prop is set', () => {
    render(<ColorPicker value="#000000" onChange={vi.fn()} disabled />);
    const swatch = screen.getByRole('button', { name: /color picker/i });
    expect(swatch).toHaveProperty('disabled', true);
  });

  it('hides alpha slider when showAlpha is false', () => {
    const { container } = render(
      <ColorPicker value="#ff0000" onChange={vi.fn()} showAlpha={false} />,
    );
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    // Should only have 1 slider (hue), not 2 (hue + alpha)
    // The hue slider should exist but alpha should not
    const alphaSlider = container.querySelector('[class*="alphaSlider"]');
    expect(alphaSlider).toBeNull();
  });

  it('hides inputs when showInputs is false', () => {
    const { container } = render(
      <ColorPicker value="#ff0000" onChange={vi.fn()} showInputs={false} />,
    );
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    const hexInput = container.querySelector('input[type="text"]');
    expect(hexInput).toBeNull();
  });

  it('shows preset colors when provided', () => {
    render(
      <ColorPicker
        value="#ff0000"
        onChange={vi.fn()}
        presetColors={['#ff0000', '#00ff00', '#0000ff']}
      />,
    );
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    const themeLabel = screen.getByText('Theme');
    expect(themeLabel).toBeDefined();
  });

  it('calls onChange when hex input is edited', () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#ff0000" onChange={onChange} />);
    const swatch = screen.getByRole('button', { name: /color picker/i });
    fireEvent.click(swatch);
    const hexInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(hexInput, { target: { value: '#00ff00' } });
    expect(onChange).toHaveBeenCalled();
  });
});

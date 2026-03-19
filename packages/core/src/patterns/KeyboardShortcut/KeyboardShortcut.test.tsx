import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { KeyboardShortcut } from './KeyboardShortcut';

describe('KeyboardShortcut', () => {
  it('renders keys', () => {
    const { container } = render(<KeyboardShortcut keys={['Ctrl', 'K']} />);
    expect(container.querySelectorAll('kbd')).toHaveLength(2);
  });

  it('renders key text', () => {
    render(<KeyboardShortcut keys={['Ctrl', 'S']} />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders separator between keys', () => {
    render(<KeyboardShortcut keys={['Ctrl', 'K']} />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('has aria-label', () => {
    const { container } = render(<KeyboardShortcut keys={['Ctrl', 'K']} />);
    expect(container.firstElementChild).toHaveAttribute('aria-label');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<KeyboardShortcut ref={ref} keys={['K']} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(<KeyboardShortcut keys={['Ctrl', 'K']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

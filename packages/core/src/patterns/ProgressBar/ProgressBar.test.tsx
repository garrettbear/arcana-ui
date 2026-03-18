import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders a progressbar role element', () => {
    render(<ProgressBar value={50} label="Upload progress" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the percentage', () => {
    render(<ProgressBar value={75} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('calculates percentage from custom max', () => {
    render(<ProgressBar value={50} max={200} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('clamps value between 0 and 100', () => {
    render(<ProgressBar value={150} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  // ─── Show value ─────────────────────────────────────────────────────
  it('shows percentage text when showValue is true', () => {
    render(<ProgressBar value={67} label="Progress" showValue />);
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('does not show value text by default', () => {
    render(<ProgressBar value={67} label="Progress" />);
    expect(screen.queryByText('67%')).not.toBeInTheDocument();
  });

  // ─── Indeterminate ──────────────────────────────────────────────────
  it('removes aria-valuenow in indeterminate mode', () => {
    render(<ProgressBar value={0} label="Loading" indeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('hides value text in indeterminate mode', () => {
    render(<ProgressBar value={50} label="Loading" indeterminate showValue />);
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  // ─── Sizes ──────────────────────────────────────────────────────────
  it('renders sm size without crashing', () => {
    const { container } = render(<ProgressBar value={30} size="sm" label="Small" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('renders lg size without crashing', () => {
    const { container } = render(<ProgressBar value={30} size="lg" label="Large" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // ─── Variants ───────────────────────────────────────────────────────
  it('renders striped variant without crashing', () => {
    const { container } = render(<ProgressBar value={50} variant="striped" label="Striped" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('renders animated variant without crashing', () => {
    const { container } = render(<ProgressBar value={50} variant="animated" label="Animated" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // ─── Colors ─────────────────────────────────────────────────────────
  it('renders all color variants without crashing', () => {
    const colors = ['primary', 'success', 'warning', 'error', 'info'] as const;
    for (const color of colors) {
      const { container } = render(<ProgressBar value={50} color={color} label={color} />);
      expect(container.firstElementChild).toBeInTheDocument();
    }
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ProgressBar ref={ref} value={50} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<ProgressBar value={50} label="Test" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('has aria-valuemin and aria-valuemax', () => {
    render(<ProgressBar value={50} label="Progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('has aria-label when label prop is provided', () => {
    render(<ProgressBar value={50} label="Upload progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload progress');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<ProgressBar value={67} label="File upload progress" showValue />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe checks in indeterminate mode', async () => {
    const { container } = render(<ProgressBar value={0} label="Loading data" indeterminate />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

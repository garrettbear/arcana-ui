import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders value and label', () => {
    render(<StatCard value="8,492" label="Active Users" />);
    expect(screen.getByText('8,492')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  it('renders prefix and suffix', () => {
    render(<StatCard value="142,580" label="Revenue" prefix="$" suffix="+" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders trend indicator', () => {
    render(<StatCard value="8,492" label="Users" trend={{ value: 12.3, direction: 'up' }} />);
    expect(screen.getByText('12.3%')).toBeInTheDocument();
    expect(screen.getByLabelText('up 12.3%')).toBeInTheDocument();
  });

  it('renders down trend with correct label', () => {
    render(<StatCard value="3.2" label="Rate" trend={{ value: 0.4, direction: 'down' }} />);
    expect(screen.getByLabelText('down 0.4%')).toBeInTheDocument();
  });

  it('renders comparison text', () => {
    render(<StatCard value="100" label="Test" comparison="vs last month" />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders icon in default variant', () => {
    render(<StatCard value="100" label="Test" icon={<span data-testid="stat-icon">📊</span>} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('hides icon in compact variant', () => {
    render(
      <StatCard
        value="100"
        label="Test"
        variant="compact"
        icon={<span data-testid="stat-icon">📊</span>}
      />,
    );
    expect(screen.queryByTestId('stat-icon')).not.toBeInTheDocument();
  });

  // ─── Loading ────────────────────────────────────────────────────────
  it('shows loading skeleton', () => {
    const { container } = render(<StatCard value="100" label="Test" loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDListElement>();
    render(<StatCard ref={ref} value="100" label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it('passes className', () => {
    const { container } = render(<StatCard value="100" label="Test" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('uses dl/dt/dd semantic structure', () => {
    const { container } = render(<StatCard value="100" label="Test" />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toBeInTheDocument();
    expect(container.querySelector('dd')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <StatCard
        value="8,492"
        label="Active Users"
        prefix="$"
        trend={{ value: 5.7, direction: 'up' }}
        comparison="vs last month"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe checks in compact variant', async () => {
    const { container } = render(<StatCard value="100" label="Test" variant="compact" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

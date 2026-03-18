import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { KPICard } from './KPICard';

const sparklineData = [10, 15, 12, 18, 20, 17, 22, 25, 23, 28];

describe('KPICard', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders value and label', () => {
    render(<KPICard value="$142,580" label="Revenue" />);
    expect(screen.getByText('$142,580')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders prefix and suffix', () => {
    render(<KPICard value="142,580" label="Revenue" prefix="$" suffix="+" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders trend indicator', () => {
    render(<KPICard value="8,492" label="Users" trend={{ value: 5.7, direction: 'up' }} />);
    expect(screen.getByText('5.7%')).toBeInTheDocument();
    expect(screen.getByLabelText('up 5.7%')).toBeInTheDocument();
  });

  it('renders down trend correctly', () => {
    render(<KPICard value="3.2" label="Rate" trend={{ value: 0.4, direction: 'down' }} />);
    expect(screen.getByLabelText('down 0.4%')).toBeInTheDocument();
  });

  // ─── Sparkline ──────────────────────────────────────────────────────
  it('renders sparkline SVG when data is provided', () => {
    const { container } = render(<KPICard value="100" label="Test" data={sparklineData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render sparkline with fewer than 2 data points', () => {
    const { container } = render(<KPICard value="100" label="Test" data={[5]} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders target line in sparkline', () => {
    const { container } = render(
      <KPICard
        value="100"
        label="Test"
        data={sparklineData}
        target={{ value: 20, label: '20 units' }}
      />,
    );
    const line = container.querySelector('line');
    expect(line).toBeInTheDocument();
  });

  it('renders target label text', () => {
    render(
      <KPICard
        value="100"
        label="Test"
        data={sparklineData}
        target={{ value: 20, label: '20 units' }}
      />,
    );
    expect(screen.getByText('Target: 20 units')).toBeInTheDocument();
  });

  // ─── Period ─────────────────────────────────────────────────────────
  it('renders period label', () => {
    render(<KPICard value="100" label="Test" period="Last 7 days" />);
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
  });

  // ─── Variants ───────────────────────────────────────────────────────
  it('renders compact variant without crashing', () => {
    const { container } = render(
      <KPICard value="100" label="Test" variant="compact" data={sparklineData} />,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // ─── Loading ────────────────────────────────────────────────────────
  it('shows loading skeleton', () => {
    const { container } = render(<KPICard value="100" label="Test" loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  // ─── Ref & className ───────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDListElement>();
    render(<KPICard ref={ref} value="100" label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it('passes className', () => {
    const { container } = render(<KPICard value="100" label="Test" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('uses dl/dt/dd semantic structure', () => {
    const { container } = render(<KPICard value="100" label="Test" />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toBeInTheDocument();
    expect(container.querySelector('dd')).toBeInTheDocument();
  });

  it('sparkline has aria-hidden', () => {
    const { container } = render(<KPICard value="100" label="Test" data={sparklineData} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <KPICard
        value="$142,580"
        label="Revenue"
        trend={{ value: 12.3, direction: 'up' }}
        data={sparklineData}
        period="Last 30 days"
        target={{ value: 20, label: '$150K' }}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe checks in compact loading state', async () => {
    const { container } = render(<KPICard value="0" label="Test" variant="compact" loading />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

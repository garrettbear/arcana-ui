import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { StatsBar } from './StatsBar';

const stats = [
  { value: 10000, label: 'Active Users', prefix: '', suffix: '+', trend: 'up' as const },
  { value: '99.9', label: 'Uptime', suffix: '%' },
  { value: 50, label: 'Countries' },
  { value: 4.9, label: 'Rating', prefix: '', suffix: '/5', trend: 'up' as const },
];

// Mock IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = class {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe(el: Element) {
      // Trigger as visible immediately
      this.callback(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  } as unknown as typeof IntersectionObserver;
});

describe('StatsBar', () => {
  // --- Smoke
  it('renders as section element', () => {
    const { container } = render(<StatsBar stats={stats} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<StatsBar ref={ref} stats={stats} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<StatsBar stats={stats} className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  // --- dl/dt/dd structure
  it('uses dl/dt/dd semantic structure', () => {
    const { container } = render(<StatsBar stats={stats} />);
    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelectorAll('dt')).toHaveLength(4);
    expect(container.querySelectorAll('dd')).toHaveLength(4);
  });

  // --- Stats display
  it('renders stat labels', () => {
    render(<StatsBar stats={stats} />);
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('Countries')).toBeInTheDocument();
  });

  it('renders prefix and suffix', () => {
    render(<StatsBar stats={[{ value: 100, label: 'Revenue', prefix: '$', suffix: 'M' }]} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  // --- Trends
  it('renders trend up indicator', () => {
    render(<StatsBar stats={[{ value: 100, label: 'Growth', trend: 'up' }]} />);
    expect(screen.getByLabelText('trending up')).toBeInTheDocument();
  });

  it('renders trend down indicator', () => {
    render(<StatsBar stats={[{ value: 100, label: 'Churn', trend: 'down' }]} />);
    expect(screen.getByLabelText('trending down')).toBeInTheDocument();
  });

  it('does not render trend for neutral', () => {
    const { container } = render(
      <StatsBar stats={[{ value: 100, label: 'Stable', trend: 'neutral' }]} />,
    );
    expect(container.querySelector('[class*="trend"]')).toBeNull();
  });

  // --- Variants
  it('applies inline variant by default', () => {
    const { container } = render(<StatsBar stats={stats} />);
    expect(container.querySelector('[class*="inline"]')).toBeTruthy();
  });

  it('applies card variant', () => {
    const { container } = render(<StatsBar stats={stats} variant="card" />);
    expect(container.querySelector('[class*="card"]')).toBeTruthy();
  });

  // --- String values
  it('renders string values without animation', () => {
    render(<StatsBar stats={[{ value: '24/7', label: 'Support' }]} />);
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });

  // --- Children
  it('renders children', () => {
    render(
      <StatsBar stats={stats}>
        <span data-testid="extra">Extra</span>
      </StatsBar>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<StatsBar stats={stats} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

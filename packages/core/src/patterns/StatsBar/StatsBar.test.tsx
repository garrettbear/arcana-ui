import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatItem, StatsBar } from './StatsBar';

describe('StatsBar', () => {
  it('renders as dl element', () => {
    const { container } = render(
      <StatsBar>
        <StatItem value="100" label="Users" />
      </StatsBar>,
    );
    expect(container.querySelector('dl')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <StatsBar ref={ref}>
        <StatItem value="100" label="Users" />
      </StatsBar>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <StatsBar className="custom">
        <StatItem value="100" label="Users" />
      </StatsBar>,
    );
    expect(container.querySelector('dl')?.classList.contains('custom')).toBe(true);
  });

  it('renders inline variant by default', () => {
    const { container } = render(
      <StatsBar>
        <StatItem value="100" label="Users" />
      </StatsBar>,
    );
    expect(container.querySelector('dl')?.className).toContain('inline');
  });

  it('renders card variant', () => {
    const { container } = render(
      <StatsBar variant="card">
        <StatItem value="100" label="Users" />
      </StatsBar>,
    );
    expect(container.querySelector('dl')?.className).toContain('card');
  });

  it('renders stat value in dd and label in dt', () => {
    const { container } = render(
      <StatsBar>
        <StatItem value="10K+" label="Active Users" />
      </StatsBar>,
    );
    const dd = container.querySelector('dd');
    const dt = container.querySelector('dt');
    expect(dd?.textContent).toContain('10K+');
    expect(dt?.textContent).toBe('Active Users');
  });

  it('renders prefix and suffix', () => {
    render(
      <StatsBar>
        <StatItem value="2.5" label="Revenue" prefix="$" suffix="M" />
      </StatsBar>,
    );
    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('2.5')).toBeTruthy();
    expect(screen.getByText('M')).toBeTruthy();
  });

  it('renders trend up indicator', () => {
    render(
      <StatsBar>
        <StatItem value="15" label="Growth" suffix="%" trend="up" />
      </StatsBar>,
    );
    expect(screen.getByLabelText('trending up')).toBeTruthy();
  });

  it('renders trend down indicator', () => {
    render(
      <StatsBar>
        <StatItem value="3" label="Churn" suffix="%" trend="down" />
      </StatsBar>,
    );
    expect(screen.getByLabelText('trending down')).toBeTruthy();
  });

  it('does not render trend indicator for neutral', () => {
    const { container } = render(
      <StatsBar>
        <StatItem value="50" label="Score" trend="neutral" />
      </StatsBar>,
    );
    expect(container.querySelector('[class*="trend"]')).toBeNull();
  });

  it('renders multiple stats', () => {
    const { container } = render(
      <StatsBar columns={3}>
        <StatItem value="10K" label="Users" />
        <StatItem value="99.9" label="Uptime" suffix="%" />
        <StatItem value="24/7" label="Support" />
      </StatsBar>,
    );
    expect(container.querySelectorAll('dd')).toHaveLength(3);
    expect(container.querySelectorAll('dt')).toHaveLength(3);
  });

  it('StatItem forwards ref', () => {
    const ref = vi.fn();
    render(
      <StatsBar>
        <StatItem ref={ref} value="100" label="Items" />
      </StatsBar>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('renders with column count class', () => {
    const { container } = render(
      <StatsBar columns={4}>
        <StatItem value="1" label="A" />
      </StatsBar>,
    );
    expect(container.querySelector('dl')?.className).toContain('cols4');
  });
});

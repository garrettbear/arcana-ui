import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatItem, StatsBar } from './StatsBar';

describe('StatsBar', () => {
  it('renders as div', () => {
    const { container } = render(
      <StatsBar>
        <StatItem value="100+" label="Users" />
      </StatsBar>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <StatsBar ref={ref}>
        <StatItem value="100+" label="Users" />
      </StatsBar>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <StatsBar className="custom">
        <StatItem value="100+" label="Users" />
      </StatsBar>,
    );
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('renders stat value and label', () => {
    render(
      <StatsBar>
        <StatItem value="10K+" label="Active Users" />
      </StatsBar>,
    );
    expect(screen.getByText('10K+')).toBeTruthy();
    expect(screen.getByText('Active Users')).toBeTruthy();
  });

  it('renders multiple stats', () => {
    render(
      <StatsBar>
        <StatItem value="10K+" label="Users" />
        <StatItem value="99.9%" label="Uptime" />
        <StatItem value="24/7" label="Support" />
      </StatsBar>,
    );
    expect(screen.getByText('10K+')).toBeTruthy();
    expect(screen.getByText('99.9%')).toBeTruthy();
    expect(screen.getByText('24/7')).toBeTruthy();
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

  it('renders with custom column count', () => {
    const { container } = render(
      <StatsBar columns={4}>
        <StatItem value="1" label="A" />
        <StatItem value="2" label="B" />
        <StatItem value="3" label="C" />
        <StatItem value="4" label="D" />
      </StatsBar>,
    );
    expect(container.firstElementChild?.className).toContain('cols4');
  });
});

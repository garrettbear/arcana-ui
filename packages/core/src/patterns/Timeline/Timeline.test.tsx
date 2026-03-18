import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Timeline, TimelineItem } from './Timeline';

describe('Timeline', () => {
  it('renders with role="list"', () => {
    render(
      <Timeline>
        <TimelineItem>First event</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByRole('list')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Timeline ref={ref}>
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <Timeline className="custom">
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('renders timeline items with role="listitem"', () => {
    render(
      <Timeline>
        <TimelineItem>First</TimelineItem>
        <TimelineItem>Second</TimelineItem>
      </Timeline>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders item with date', () => {
    render(
      <Timeline>
        <TimelineItem date="Jan 2026">Launch</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText('Jan 2026')).toBeTruthy();
    expect(screen.getByText('Launch')).toBeTruthy();
  });

  it('renders item with icon', () => {
    render(
      <Timeline>
        <TimelineItem icon={<svg data-testid="icon" />}>Event</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('renders alternate variant', () => {
    const { container } = render(
      <Timeline position="alternate">
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.firstElementChild?.className).toContain('alternate');
  });

  it('TimelineItem forwards ref', () => {
    const ref = vi.fn();
    render(
      <Timeline>
        <TimelineItem ref={ref}>Event</TimelineItem>
      </Timeline>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('renders multiple items with dates', () => {
    render(
      <Timeline>
        <TimelineItem date="2024">Founded</TimelineItem>
        <TimelineItem date="2025">Series A</TimelineItem>
        <TimelineItem date="2026">IPO</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText('Founded')).toBeTruthy();
    expect(screen.getByText('Series A')).toBeTruthy();
    expect(screen.getByText('IPO')).toBeTruthy();
  });
});

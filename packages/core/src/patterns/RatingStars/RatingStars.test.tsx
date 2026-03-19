import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RatingStars } from './RatingStars';

describe('RatingStars', () => {
  // ─── Rendering ──────────────────────────────────────────────────────

  it('renders the correct number of stars', () => {
    const { container } = render(<RatingStars value={3} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  it('renders custom max stars', () => {
    const { container } = render(<RatingStars value={3} max={10} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(10);
  });

  it('shows correct fill for full stars', () => {
    const { container } = render(<RatingStars value={3} />);
    const filledPaths = container.querySelectorAll('[class*="starFilled"]');
    // 3 full stars = 3 filled paths
    expect(filledPaths).toHaveLength(3);
  });

  it('renders half star with clip-path', () => {
    const { container } = render(<RatingStars value={2.5} />);
    const clipPaths = container.querySelectorAll('clipPath');
    expect(clipPaths).toHaveLength(1);
    // 2 full + 1 half = 3 filled paths
    const filledPaths = container.querySelectorAll('[class*="starFilled"]');
    expect(filledPaths).toHaveLength(3);
  });

  // ─── Count ──────────────────────────────────────────────────────────

  it('displays count text', () => {
    render(<RatingStars value={4} count={128} />);
    expect(screen.getByText('(128)')).toBeInTheDocument();
  });

  it('does not display count when not provided', () => {
    const { container } = render(<RatingStars value={4} />);
    expect(container.querySelector('[class*="count"]')).not.toBeInTheDocument();
  });

  // ─── Accessibility ────────────────────────────────────────────────

  it('has correct aria-label in display mode', () => {
    render(<RatingStars value={3.5} max={5} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '3.5 out of 5 stars');
  });

  it('has radiogroup role in interactive mode', () => {
    render(<RatingStars value={3} interactive onChange={() => {}} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  // ─── Interactive ──────────────────────────────────────────────────

  it('calls onChange on star click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={2} interactive onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[3]); // 4th star
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('supports keyboard arrow navigation', () => {
    const onChange = vi.fn();
    render(<RatingStars value={3} interactive onChange={onChange} />);
    const group = screen.getByRole('radiogroup');

    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(4);

    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clamps keyboard navigation to min/max', () => {
    const onChange = vi.fn();
    render(<RatingStars value={5} max={5} interactive onChange={onChange} />);
    const group = screen.getByRole('radiogroup');

    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ─── Sizes ────────────────────────────────────────────────────────

  it('applies size class', () => {
    const { container } = render(<RatingStars value={3} size="lg" />);
    expect(container.firstChild).toHaveClass(/size-lg/);
  });

  // ─── Ref forwarding ──────────────────────────────────────────────

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RatingStars ref={ref} value={3} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ─── className passthrough ────────────────────────────────────────

  it('passes className to root element', () => {
    const { container } = render(<RatingStars value={3} className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  // ─── Axe ──────────────────────────────────────────────────────────

  it('passes axe accessibility check (display mode)', async () => {
    const { container } = render(<RatingStars value={4} count={50} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility check (interactive mode)', async () => {
    const { container } = render(<RatingStars value={3} interactive onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

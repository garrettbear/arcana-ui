import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders text variant by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[class*="text"]')).toBeInTheDocument();
  });

  it('renders circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.querySelector('[class*="circular"]')).toBeInTheDocument();
  });

  it('renders rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    expect(container.querySelector('[class*="rectangular"]')).toBeInTheDocument();
  });

  it('renders multiple text lines', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const group = container.querySelector('[class*="textGroup"]');
    expect(group).toBeInTheDocument();
    expect(group?.children).toHaveLength(3);
  });

  it('last line has shorter width', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const group = container.querySelector('[class*="textGroup"]');
    const lastChild = group?.lastElementChild;
    expect(lastChild?.className).toContain('lastLine');
  });

  it('has aria-hidden on individual elements', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has aria-busy on text group', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });

  it('renders without animation when animate is false', () => {
    const { container } = render(<Skeleton animate={false} />);
    expect(container.querySelector('[class*="animate"]')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});

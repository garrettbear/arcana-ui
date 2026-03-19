import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  it('formats USD currency correctly', () => {
    render(<PriceDisplay value={29.99} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('formats GBP currency', () => {
    render(<PriceDisplay value={100} currency="GBP" locale="en-GB" />);
    expect(screen.getByText('£100.00')).toBeInTheDocument();
  });

  it('shows original price struck through in sale mode', () => {
    render(<PriceDisplay value={19.99} originalValue={39.99} />);
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });

  it('has aria-label with formatted price', () => {
    const { container } = render(<PriceDisplay value={99.99} />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', '$99.99');
  });

  it('has aria-label with sale context', () => {
    const { container } = render(<PriceDisplay value={19.99} originalValue={39.99} />);
    expect(container.firstElementChild?.getAttribute('aria-label')).toContain('reduced from');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PriceDisplay ref={ref} value={29.99} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(<PriceDisplay value={29.99} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes axe check in sale mode', async () => {
    const { container } = render(<PriceDisplay value={19.99} originalValue={39.99} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

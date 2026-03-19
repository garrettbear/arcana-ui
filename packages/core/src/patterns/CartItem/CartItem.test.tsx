import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CartItem } from './CartItem';

const defaultProps = {
  image: 'https://example.com/shoe.jpg',
  title: 'Running Shoe',
  price: 129.99,
  quantity: 2,
  onQuantityChange: vi.fn(),
  onRemove: vi.fn(),
};

describe('CartItem', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders the product title', () => {
    render(<CartItem {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Running Shoe' })).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    render(<CartItem {...defaultProps} />);
    expect(screen.getByText('$129.99')).toBeInTheDocument();
  });

  it('renders the product image with alt text', () => {
    render(<CartItem {...defaultProps} />);
    const img = screen.getByAltText('Running Shoe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/shoe.jpg');
  });

  it('renders variant text when provided', () => {
    render(<CartItem {...defaultProps} variant="Size M, Blue" />);
    expect(screen.getByText('Size M, Blue')).toBeInTheDocument();
  });

  it('does not render variant text when not provided', () => {
    const { container } = render(<CartItem {...defaultProps} />);
    expect(container.querySelector('p')).toBeInTheDocument(); // price paragraph
    // only price paragraph, no variant
    const paragraphs = container.querySelectorAll('p');
    const texts = Array.from(paragraphs).map((p) => p.textContent);
    expect(texts).not.toContain('Size M, Blue');
  });

  // ─── Quantity change ──────────────────────────────────────────────
  it('calls onQuantityChange when quantity is incremented', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn();
    render(<CartItem {...defaultProps} onQuantityChange={onQuantityChange} />);
    await user.click(screen.getByLabelText('Increase quantity'));
    expect(onQuantityChange).toHaveBeenCalledWith(3);
  });

  // ─── Remove ───────────────────────────────────────────────────────
  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<CartItem {...defaultProps} onRemove={onRemove} />);
    await user.click(screen.getByLabelText('Remove Running Shoe from cart'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  // ─── ARIA ─────────────────────────────────────────────────────────
  it('has a group role with the product title as label', () => {
    render(<CartItem {...defaultProps} />);
    expect(screen.getByRole('group', { name: 'Running Shoe' })).toBeInTheDocument();
  });

  it('remove button has descriptive aria-label', () => {
    render(<CartItem {...defaultProps} />);
    expect(screen.getByLabelText('Remove Running Shoe from cart')).toBeInTheDocument();
  });

  // ─── Ref & className ─────────────────────────────────────────────
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CartItem ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<CartItem {...defaultProps} className="custom-cart" />);
    expect(container.firstElementChild).toHaveClass('custom-cart');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(<CartItem {...defaultProps} variant="Size 10, White" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

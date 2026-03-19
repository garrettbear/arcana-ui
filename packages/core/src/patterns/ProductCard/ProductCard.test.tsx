import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders title and price', () => {
    render(<ProductCard image="/test.jpg" title="Test Product" price={49.99} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('renders sale price with original', () => {
    render(
      <ProductCard
        image="/test.jpg"
        title="Sale Item"
        price={{ current: 29.99, original: 49.99 }}
      />,
    );
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<ProductCard image="/test.jpg" title="New Product" price={99} badge="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders rating stars', () => {
    render(
      <ProductCard
        image="/test.jpg"
        title="Rated"
        price={50}
        rating={{ value: 4.5, count: 128 }}
      />,
    );
    expect(screen.getByLabelText('4.5 out of 5 stars')).toBeInTheDocument();
    expect(screen.getByText('(128)')).toBeInTheDocument();
  });

  it('renders add to cart button', async () => {
    const onAdd = vi.fn();
    render(<ProductCard image="/test.jpg" title="Product" price={25} onAddToCart={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(onAdd).toHaveBeenCalled();
  });

  it('renders favorite button', async () => {
    const onFav = vi.fn();
    render(<ProductCard image="/test.jpg" title="Product" price={25} onFavorite={onFav} />);
    await userEvent.click(screen.getByLabelText('Add to favorites'));
    expect(onFav).toHaveBeenCalled();
  });

  it('renders as link when href provided', () => {
    const { container } = render(
      <ProductCard image="/test.jpg" title="Linked" price={25} href="/product/1" />,
    );
    expect(container.querySelector('a[href="/product/1"]')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = render(
      <ProductCard image="/test.jpg" title="Loading" price={25} loading />,
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('hides add-to-cart in compact variant', () => {
    render(
      <ProductCard
        image="/test.jpg"
        title="Compact"
        price={25}
        variant="compact"
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Add to Cart' })).not.toBeInTheDocument();
  });

  it('passes axe checks', async () => {
    const { container } = render(
      <ProductCard image="/test.jpg" title="Accessible Product" price={49.99} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

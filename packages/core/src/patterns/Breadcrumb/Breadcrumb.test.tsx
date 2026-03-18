import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders as nav with Breadcrumb aria-label', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Breadcrumb ref={ref}>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('renders items as links when href provided', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem current>Widget</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Products' })).toBeTruthy();
  });

  it('marks current item with aria-current="page"', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Current</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByText('Current').getAttribute('aria-current')).toBe('page');
  });

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem current>Widget</BreadcrumbItem>
      </Breadcrumb>,
    );
    // 3 items = 2 separators
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it('supports custom separator', () => {
    render(
      <Breadcrumb separator={<span data-testid="sep">/</span>}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByTestId('sep')).toBeTruthy();
  });

  it('renders current item as span not link', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/" current>
          Home
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    // Current items should be spans, not links
    expect(screen.queryByRole('link', { name: 'Home' })).toBeNull();
    expect(screen.getByText('Home').tagName).toBe('SPAN');
  });

  it('accepts className', () => {
    const { container } = render(
      <Breadcrumb className="custom">
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(container.querySelector('nav')?.classList.contains('custom')).toBe(true);
  });
});

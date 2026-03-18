import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Testimonial, TestimonialAuthor, TestimonialQuote } from './Testimonial';

describe('Testimonial', () => {
  it('renders as figure element', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great product!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial ref={ref}>
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <Testimonial className="custom">
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')?.classList.contains('custom')).toBe(true);
  });

  it('renders quote text', () => {
    render(
      <Testimonial>
        <TestimonialQuote>This changed my workflow</TestimonialQuote>
      </Testimonial>,
    );
    expect(screen.getByText('This changed my workflow')).toBeTruthy();
  });

  it('renders author name', () => {
    render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" />
      </Testimonial>,
    );
    expect(screen.getByText('Jane Doe')).toBeTruthy();
  });

  it('renders author with title', () => {
    render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" title="CEO at Acme" />
      </Testimonial>,
    );
    expect(screen.getByText('CEO at Acme')).toBeTruthy();
  });

  it('renders author avatar', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" avatar="/avatar.png" />
      </Testimonial>,
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/avatar.png');
  });

  it('renders inline variant', () => {
    const { container } = render(
      <Testimonial variant="inline">
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')?.className).toContain('inline');
  });

  it('TestimonialQuote forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial>
        <TestimonialQuote ref={ref}>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('TestimonialAuthor forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial>
        <TestimonialAuthor ref={ref} name="Jane" />
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

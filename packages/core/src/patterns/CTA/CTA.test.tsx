import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CTA, CTAActions, CTADescription, CTASection, CTATitle } from './CTA';

describe('CTASection', () => {
  it('renders as section element', () => {
    const { container } = render(<CTASection>Content</CTASection>);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<CTASection ref={ref}>Content</CTASection>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<CTASection className="custom">Content</CTASection>);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('has aria-label', () => {
    const { container } = render(<CTASection>Content</CTASection>);
    expect(container.querySelector('section')?.getAttribute('aria-label')).toBe('Call to action');
  });

  it('renders banner variant by default', () => {
    const { container } = render(<CTASection>Content</CTASection>);
    expect(container.querySelector('section')?.className).toContain('banner');
  });

  it('renders card variant', () => {
    const { container } = render(<CTASection variant="card">Content</CTASection>);
    expect(container.querySelector('section')?.className).toContain('card');
  });

  it('renders minimal variant', () => {
    const { container } = render(<CTASection variant="minimal">Content</CTASection>);
    expect(container.querySelector('section')?.className).toContain('minimal');
  });

  it('renders CTATitle as h2 by default', () => {
    render(
      <CTASection>
        <CTATitle>Get Started Today</CTATitle>
      </CTASection>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Get Started Today' })).toBeTruthy();
  });

  it('renders CTATitle as custom heading', () => {
    render(
      <CTASection>
        <CTATitle as="h3">Ready?</CTATitle>
      </CTASection>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Ready?' })).toBeTruthy();
  });

  it('renders CTADescription', () => {
    render(
      <CTASection>
        <CTADescription>Join thousands</CTADescription>
      </CTASection>,
    );
    expect(screen.getByText('Join thousands')).toBeTruthy();
  });

  it('renders CTAActions with buttons', () => {
    render(
      <CTASection>
        <CTAActions>
          <button type="button">Sign Up</button>
          <button type="button">Learn More</button>
        </CTAActions>
      </CTASection>,
    );
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeTruthy();
  });

  it('CTATitle forwards ref', () => {
    const ref = vi.fn();
    render(
      <CTASection>
        <CTATitle ref={ref}>Title</CTATitle>
      </CTASection>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('CTA alias works as CTASection', () => {
    const { container } = render(<CTA>Content</CTA>);
    expect(container.querySelector('section')).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CTA, CTAActions, CTADescription, CTATitle } from './CTA';

describe('CTA', () => {
  it('renders as section element', () => {
    const { container } = render(<CTA>Content</CTA>);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<CTA ref={ref}>Content</CTA>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<CTA className="custom">Content</CTA>);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders filled variant', () => {
    const { container } = render(<CTA variant="filled">Content</CTA>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('filled');
  });

  it('renders left-aligned', () => {
    const { container } = render(<CTA align="left">Content</CTA>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('alignLeft');
  });

  it('renders CTATitle as h2 by default', () => {
    render(
      <CTA>
        <CTATitle>Get Started Today</CTATitle>
      </CTA>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Get Started Today' })).toBeTruthy();
  });

  it('renders CTATitle as custom heading', () => {
    render(
      <CTA>
        <CTATitle as="h3">Ready?</CTATitle>
      </CTA>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Ready?' })).toBeTruthy();
  });

  it('renders CTADescription', () => {
    render(
      <CTA>
        <CTADescription>Join thousands of users</CTADescription>
      </CTA>,
    );
    expect(screen.getByText('Join thousands of users')).toBeTruthy();
  });

  it('renders CTAActions', () => {
    render(
      <CTA>
        <CTAActions>
          <button type="button">Sign Up</button>
        </CTAActions>
      </CTA>,
    );
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeTruthy();
  });

  it('CTATitle forwards ref', () => {
    const ref = vi.fn();
    render(
      <CTA>
        <CTATitle ref={ref}>Title</CTATitle>
      </CTA>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

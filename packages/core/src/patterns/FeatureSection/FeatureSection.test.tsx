import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { FeatureSection } from './FeatureSection';

const features = [
  {
    icon: <svg data-testid="icon-1" />,
    title: 'Lightning Fast',
    description: 'Built for speed and performance.',
  },
  { title: 'Secure', description: 'Enterprise-grade security built in.' },
  {
    title: 'Simple',
    description: 'Easy to use for everyone.',
    link: { label: 'Learn more', href: '/features/simple' },
  },
];

describe('FeatureSection', () => {
  // --- Smoke
  it('renders as section element', () => {
    const { container } = render(<FeatureSection features={features} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<FeatureSection ref={ref} features={features} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<FeatureSection features={features} className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  // --- Title + subtitle
  it('renders title and subtitle', () => {
    render(<FeatureSection title="Features" subtitle="Everything you need" features={features} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Features' })).toBeInTheDocument();
    expect(screen.getByText('Everything you need')).toBeInTheDocument();
  });

  it('has aria-labelledby when title is provided', () => {
    const { container } = render(<FeatureSection title="Features" features={features} />);
    const section = container.querySelector('section');
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(section?.getAttribute('aria-labelledby')).toBe(h2.id);
  });

  // --- Features
  it('renders all feature items', () => {
    render(<FeatureSection features={features} />);
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Simple')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeatureSection features={features} />);
    expect(screen.getByText('Built for speed and performance.')).toBeInTheDocument();
  });

  it('renders feature icon with aria-hidden', () => {
    const { container } = render(<FeatureSection features={features} />);
    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders feature link', () => {
    render(<FeatureSection features={features} />);
    const link = screen.getByRole('link', { name: 'Learn more' });
    expect(link).toHaveAttribute('href', '/features/simple');
  });

  // --- Variants
  it('applies grid variant by default', () => {
    const { container } = render(<FeatureSection features={features} />);
    expect(container.querySelector('[class*="grid"]')).toBeTruthy();
  });

  it('applies list variant', () => {
    const { container } = render(<FeatureSection features={features} variant="list" />);
    expect(container.querySelector('[class*="list"]')).toBeTruthy();
  });

  it('applies alternating variant', () => {
    const { container } = render(<FeatureSection features={features} variant="alternating" />);
    expect(container.querySelector('[class*="alternating"]')).toBeTruthy();
  });

  // --- Columns
  it('applies column classes', () => {
    const { container } = render(<FeatureSection features={features} columns={4} />);
    expect(container.querySelector('[class*="cols4"]')).toBeTruthy();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(
      <FeatureSection title="Features" subtitle="Great stuff" features={features} />,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

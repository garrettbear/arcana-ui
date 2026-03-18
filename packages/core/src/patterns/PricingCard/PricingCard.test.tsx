import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  PricingCard,
  PricingCardAction,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardHeader,
  PricingCardPrice,
} from './PricingCard';

describe('PricingCard', () => {
  it('renders as div', () => {
    const { container } = render(<PricingCard>Content</PricingCard>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<PricingCard ref={ref}>Content</PricingCard>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<PricingCard className="custom">Content</PricingCard>);
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('renders featured variant', () => {
    const { container } = render(<PricingCard featured>Content</PricingCard>);
    expect(container.firstElementChild?.className).toContain('featured');
  });

  it('renders plan name in header', () => {
    render(
      <PricingCard>
        <PricingCardHeader plan="Pro" />
      </PricingCard>,
    );
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeTruthy();
  });

  it('renders plan description', () => {
    render(
      <PricingCard>
        <PricingCardHeader plan="Pro" description="For teams" />
      </PricingCard>,
    );
    expect(screen.getByText('For teams')).toBeTruthy();
  });

  it('renders price with period', () => {
    render(
      <PricingCard>
        <PricingCardPrice amount="$29" period="/month" />
      </PricingCard>,
    );
    expect(screen.getByText('$29')).toBeTruthy();
    expect(screen.getByText('/month')).toBeTruthy();
  });

  it('renders feature list', () => {
    render(
      <PricingCard>
        <PricingCardFeatures>
          <PricingCardFeature>10 users</PricingCardFeature>
          <PricingCardFeature>API access</PricingCardFeature>
          <PricingCardFeature included={false}>Priority support</PricingCardFeature>
        </PricingCardFeatures>
      </PricingCard>,
    );
    expect(screen.getByText('10 users')).toBeTruthy();
    expect(screen.getByText('API access')).toBeTruthy();
    expect(screen.getByText('Priority support')).toBeTruthy();
  });

  it('renders excluded feature with strikethrough', () => {
    const { container } = render(
      <PricingCard>
        <PricingCardFeatures>
          <PricingCardFeature included={false}>Priority support</PricingCardFeature>
        </PricingCardFeatures>
      </PricingCard>,
    );
    const item = container.querySelector('li');
    expect(item?.className).toContain('featureExcluded');
  });

  it('renders action slot', () => {
    render(
      <PricingCard>
        <PricingCardAction>
          <button type="button">Subscribe</button>
        </PricingCardAction>
      </PricingCard>,
    );
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeTruthy();
  });

  it('PricingCardHeader forwards ref', () => {
    const ref = vi.fn();
    render(
      <PricingCard>
        <PricingCardHeader ref={ref} plan="Pro" />
      </PricingCard>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeatureItem, FeatureSection } from './FeatureSection';

describe('FeatureSection', () => {
  it('renders as section element', () => {
    const { container } = render(
      <FeatureSection>
        <FeatureItem title="Fast">Lightning fast</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <FeatureSection ref={ref}>
        <FeatureItem title="Fast">Lightning fast</FeatureItem>
      </FeatureSection>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <FeatureSection className="custom">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders FeatureItem with title', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Lightning Fast">Speed matters</FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByRole('heading', { name: 'Lightning Fast' })).toBeTruthy();
  });

  it('renders FeatureItem with description', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Fast" description="Built for speed">
          Extra
        </FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByText('Built for speed')).toBeTruthy();
  });

  it('renders FeatureItem icon with aria-hidden', () => {
    const { container } = render(
      <FeatureSection>
        <FeatureItem title="Fast" icon={<svg data-testid="icon" />}>
          Content
        </FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders multiple items', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Fast">Speed</FeatureItem>
        <FeatureItem title="Secure">Safety</FeatureItem>
        <FeatureItem title="Simple">Easy</FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('FeatureItem forwards ref', () => {
    const ref = vi.fn();
    render(
      <FeatureSection>
        <FeatureItem ref={ref} title="Fast">
          Content
        </FeatureItem>
      </FeatureSection>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

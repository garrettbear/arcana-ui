import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Hero, HeroActions, HeroContent, HeroDescription, HeroMedia, HeroTitle } from './Hero';

describe('Hero', () => {
  it('renders as section element', () => {
    const { container } = render(<Hero>Content</Hero>);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Hero ref={ref}>Content</Hero>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<Hero className="custom">Content</Hero>);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders split variant', () => {
    const { container } = render(<Hero variant="split">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('split');
  });

  it('renders fullHeight', () => {
    const { container } = render(<Hero fullHeight>Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('fullHeight');
  });

  it('renders left-aligned', () => {
    const { container } = render(<Hero align="left">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('alignLeft');
  });

  it('renders HeroTitle as h1 by default', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroTitle>Welcome</HeroTitle>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome' })).toBeTruthy();
  });

  it('renders HeroTitle as custom heading level', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroTitle as="h2">Welcome</HeroTitle>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Welcome' })).toBeTruthy();
  });

  it('renders HeroDescription', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroDescription>A great product</HeroDescription>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByText('A great product')).toBeTruthy();
  });

  it('renders HeroActions', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroActions data-testid="actions">
            <button type="button">Get Started</button>
          </HeroActions>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByTestId('actions')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy();
  });

  it('renders HeroMedia', () => {
    render(
      <Hero>
        <HeroMedia data-testid="media">
          <img src="/hero.png" alt="Hero" />
        </HeroMedia>
      </Hero>,
    );
    expect(screen.getByTestId('media')).toBeTruthy();
    expect(screen.getByAltText('Hero')).toBeTruthy();
  });

  it('HeroContent forwards ref', () => {
    const ref = vi.fn();
    render(
      <Hero>
        <HeroContent ref={ref}>Content</HeroContent>
      </Hero>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

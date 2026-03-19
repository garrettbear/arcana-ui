import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { AuthorCard } from './AuthorCard';

describe('AuthorCard', () => {
  it('renders name', () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders job role', () => {
    // biome-ignore lint/a11y/useValidAriaRole: "role" here is a component prop (job title), not ARIA role
    render(<AuthorCard name="Jane" role="Editor" />);
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });

  it('renders bio in card variant', () => {
    render(<AuthorCard name="Jane" variant="card" bio="A writer." />);
    expect(screen.getByText('A writer.')).toBeInTheDocument();
  });

  it('hides bio in inline variant', () => {
    render(<AuthorCard name="Jane" variant="inline" bio="A writer." />);
    expect(screen.queryByText('A writer.')).not.toBeInTheDocument();
  });

  it('renders social links in card variant', () => {
    render(
      <AuthorCard
        name="Jane"
        variant="card"
        social={[{ platform: 'Twitter', url: 'https://x.com' }]}
      />,
    );
    expect(screen.getByLabelText('Jane on Twitter')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AuthorCard ref={ref} name="Jane" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe checks', async () => {
    // biome-ignore lint/a11y/useValidAriaRole: "role" is component prop (job title), not ARIA role
    const { container } = render(<AuthorCard name="Jane Doe" role="Writer" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

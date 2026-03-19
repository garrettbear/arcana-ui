import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ArticleLayout } from './ArticleLayout';

describe('ArticleLayout', () => {
  it('renders article element', () => {
    render(<ArticleLayout>Content</ArticleLayout>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ArticleLayout>
        <p>Hello world</p>
      </ArticleLayout>,
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(<ArticleLayout sidebar={<nav>TOC</nav>}>Content</ArticleLayout>);
    expect(screen.getByText('TOC')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<ArticleLayout ref={ref}>Content</ArticleLayout>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(<ArticleLayout>Content</ArticleLayout>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

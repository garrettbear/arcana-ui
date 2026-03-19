import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { RelatedPosts } from './RelatedPosts';

const posts = [
  { title: 'Post One', href: '/post-1', category: 'Design' },
  { title: 'Post Two', href: '/post-2', date: 'Mar 15' },
  { title: 'Post Three', href: '/post-3', author: 'Jane' },
];

describe('RelatedPosts', () => {
  it('renders all posts', () => {
    render(<RelatedPosts posts={posts} />);
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<RelatedPosts posts={posts} title="More Articles" />);
    expect(screen.getByText('More Articles')).toBeInTheDocument();
  });

  it('renders as nav with aria-label', () => {
    render(<RelatedPosts posts={posts} />);
    expect(screen.getByRole('navigation', { name: 'Related Posts' })).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<RelatedPosts posts={posts} />);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<RelatedPosts ref={ref} posts={posts} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(<RelatedPosts posts={posts} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

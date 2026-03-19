import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { PullQuote } from './PullQuote';

describe('PullQuote', () => {
  it('renders quote text', () => {
    render(<PullQuote quote="Design is not just what it looks like." />);
    expect(screen.getByText('Design is not just what it looks like.')).toBeInTheDocument();
  });

  it('renders attribution', () => {
    render(<PullQuote quote="Test quote" attribution="Steve Jobs" />);
    expect(screen.getByText('Steve Jobs')).toBeInTheDocument();
  });

  it('renders as blockquote', () => {
    const { container } = render(<PullQuote quote="Test" />);
    expect(container.querySelector('blockquote')).toBeInTheDocument();
  });

  it('uses cite for attribution', () => {
    const { container } = render(<PullQuote quote="Test" attribution="Author" />);
    expect(container.querySelector('cite')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLQuoteElement>();
    render(<PullQuote ref={ref} quote="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLQuoteElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(<PullQuote quote="Quote" attribution="Author" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

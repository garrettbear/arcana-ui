import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NewsletterSignup } from './NewsletterSignup';

describe('NewsletterSignup', () => {
  it('renders title and input', () => {
    render(<NewsletterSignup />);
    expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<NewsletterSignup />);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('shows error for invalid email', () => {
    render(<NewsletterSignup />);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid' },
    });
    fireEvent.submit(screen.getByRole('form', { name: 'Newsletter signup' }));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('calls onSubmit with valid email', async () => {
    const onSubmit = vi.fn();
    render(<NewsletterSignup onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledWith('test@example.com');
  });

  it('shows success message after submit', async () => {
    render(<NewsletterSignup onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
  });

  it('renders custom success message', async () => {
    render(<NewsletterSignup onSubmit={vi.fn()} successMessage="You're in!" />);
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(screen.getByText("You're in!")).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NewsletterSignup ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(<NewsletterSignup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

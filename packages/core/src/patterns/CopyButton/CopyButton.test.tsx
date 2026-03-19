import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CopyButton } from './CopyButton';

// Mock clipboard API
Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

describe('CopyButton', () => {
  it('renders label', () => {
    render(<CopyButton value="hello" />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copies to clipboard on click', async () => {
    render(<CopyButton value="hello world" />);
    await userEvent.click(screen.getByRole('button'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
  });

  it('shows copied label after click', async () => {
    render(<CopyButton value="test" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('renders custom labels', () => {
    render(<CopyButton value="test" label="Copy code" />);
    expect(screen.getByText('Copy code')).toBeInTheDocument();
  });

  it('renders icon-only variant', () => {
    render(<CopyButton value="test" variant="icon" />);
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<CopyButton ref={ref} value="test" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has aria-live region', () => {
    const { container } = render(<CopyButton value="test" />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('passes axe checks', async () => {
    const { container } = render(<CopyButton value="test" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

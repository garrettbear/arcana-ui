import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders all variants without crashing', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info', 'secondary'] as const
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders dot indicator when dot prop is true', () => {
    const { container } = render(<Badge dot>Active</Badge>)
    // The dot span has aria-hidden so we check via container query
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot).toBeInTheDocument()
  })

  it('does not render dot when dot prop is false', () => {
    const { container } = render(<Badge dot={false}>Active</Badge>)
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot).not.toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = render(<Badge>Label</Badge>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('forwards additional HTML attributes', () => {
    render(<Badge data-testid="my-badge">Test</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Badge>Status</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with dot', async () => {
    const { container } = render(<Badge dot variant="success">Online</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

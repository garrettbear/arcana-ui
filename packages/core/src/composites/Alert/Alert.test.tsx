import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Alert message</Alert>)
    expect(screen.getByText('Alert message')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Message</Alert>)
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
  })

  it('renders all variants without crashing', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    for (const variant of variants) {
      const { unmount } = render(<Alert variant={variant}>{variant}</Alert>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders with role="alert"', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders close button when onClose is provided', () => {
    render(<Alert onClose={vi.fn()}>Message</Alert>)
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument()
  })

  it('does not render close button when onClose is not provided', () => {
    render(<Alert>Message</Alert>)
    expect(screen.queryByRole('button', { name: 'Dismiss alert' })).not.toBeInTheDocument()
  })

  it('calls onClose when dismiss button is clicked', () => {
    const onClose = vi.fn()
    render(<Alert onClose={onClose}>Message</Alert>)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Alert>Accessible alert</Alert>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with title and close', async () => {
    const { container } = render(
      <Alert title="Warning" variant="warning" onClose={vi.fn()}>
        Something needs attention.
      </Alert>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks for all variants', async () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    for (const variant of variants) {
      const { container, unmount } = render(
        <Alert variant={variant} title="Title">Content</Alert>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      unmount()
    }
  })
})

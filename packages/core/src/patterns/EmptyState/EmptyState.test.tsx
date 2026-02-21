import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders required title', () => {
    render(<EmptyState title="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('renders optional description', () => {
    render(<EmptyState title="Nothing here" description="Try adding some items" />)
    expect(screen.getByText('Try adding some items')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByText('description')).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md'] as const
    for (const size of sizes) {
      const { unmount } = render(<EmptyState title="Empty" size={size} />)
      expect(screen.getByText('Empty')).toBeInTheDocument()
      unmount()
    }
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<EmptyState title="No results" description="Try a different search" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with icon and action', async () => {
    const { container } = render(
      <EmptyState
        title="Nothing here"
        description="Add your first item"
        icon={<svg aria-hidden="true" />}
        action={<button>Add item</button>}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Avatar, AvatarGroup } from './Avatar'

describe('Avatar', () => {
  it('renders with name initials', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
  })

  it('renders with an image when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" alt="Profile" />)
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  it('renders fallback icon when no src or name', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    for (const size of sizes) {
      const { unmount } = render(<Avatar name="Alice" size={size} />)
      expect(screen.getByRole('img', { name: 'Alice' })).toBeInTheDocument()
      unmount()
    }
  })

  it('shows single-word name initials correctly', () => {
    const { container } = render(<Avatar name="Alice" />)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('AL')
  })

  it('shows two-word name initials correctly', () => {
    const { container } = render(<Avatar name="John Doe" />)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('JD')
  })

  it('passes axe accessibility checks with name', async () => {
    const { container } = render(<Avatar name="Jane Smith" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with image', async () => {
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" alt="User avatar" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with fallback', async () => {
    const { container } = render(<Avatar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('AvatarGroup', () => {
  it('renders all children when no max', () => {
    render(
      <AvatarGroup>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Carol" />
      </AvatarGroup>
    )
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('limits visible avatars to max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Carol" />
        <Avatar name="Dave" />
      </AvatarGroup>
    )
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('shows overflow count when max is set', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Carol" />
        <Avatar name="Dave" />
      </AvatarGroup>
    )
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('renders as a group role', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Alice" />
      </AvatarGroup>
    )
    expect(container.querySelector('[role="group"]')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <AvatarGroup max={2}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Carol" />
      </AvatarGroup>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

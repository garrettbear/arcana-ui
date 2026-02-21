import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders without crashing', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Toggle label="Dark mode" checked={false} onChange={() => {}} />)
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('reflects checked state with aria-checked true', () => {
    render(<Toggle checked onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects unchecked state with aria-checked false', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with toggled value when clicked', () => {
    const handleChange = vi.fn()
    render(<Toggle checked={false} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when checked and clicked', () => {
    const handleChange = vi.fn()
    render(<Toggle checked onChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('renders disabled state', () => {
    render(<Toggle checked={false} disabled onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('does not call onChange when disabled', () => {
    const handleChange = vi.fn()
    render(<Toggle checked={false} disabled onChange={handleChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      const { unmount } = render(<Toggle checked={false} size={size} onChange={() => {}} />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
      unmount()
    }
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Toggle label="Enable notifications" checked={false} onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks when checked', async () => {
    const { container } = render(<Toggle label="Dark mode" checked onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks when disabled', async () => {
    const { container } = render(<Toggle label="Disabled toggle" checked={false} disabled onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders without crashing', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('Accept terms')
  })

  it('renders description when provided', () => {
    render(<Checkbox label="Newsletter" description="Receive weekly updates" />)
    expect(screen.getByText('Receive weekly updates')).toBeInTheDocument()
  })

  it('renders checked state', () => {
    render(<Checkbox label="Check me" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders unchecked state', () => {
    render(<Checkbox label="Check me" checked={false} onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders disabled state', () => {
    render(<Checkbox label="Disabled" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('renders error message', () => {
    render(<Checkbox label="Accept" error="You must accept" />)
    expect(screen.getByText('You must accept')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Click me" onChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Disabled" disabled onChange={handleChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Checkbox label="Accept terms" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks when checked', async () => {
    const { container } = render(<Checkbox label="Checked" checked onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Checkbox label="Required" error="Please check this" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

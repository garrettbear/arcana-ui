import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with a label associated to the input', () => {
    render(<Input label="Email address" />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByText('Email address')).toBeInTheDocument()
  })

  it('renders error message with role="alert"', () => {
    render(<Input error="This field is required" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('This field is required')
  })

  it('does not render alert element when error is boolean true', () => {
    render(<Input error={true} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('marks input as aria-invalid when error is set', () => {
    render(<Input error="Invalid value" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders helper text', () => {
    render(<Input helperText="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('renders in disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Input label="Username" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Input label="Username" error="Required" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

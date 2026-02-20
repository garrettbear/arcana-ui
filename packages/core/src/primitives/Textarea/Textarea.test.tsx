import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with a label associated to the textarea', () => {
    render(<Textarea label="Bio" />)
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
    expect(screen.getByText('Bio')).toBeInTheDocument()
  })

  it('renders error message with role="alert"', () => {
    render(<Textarea error="Bio is required" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Bio is required')
  })

  it('does not render alert element when error is boolean true', () => {
    render(<Textarea error={true} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('marks textarea as aria-invalid when error is set', () => {
    render(<Textarea error="Invalid" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows character count with showCount and maxLength', () => {
    render(<Textarea showCount maxLength={100} />)
    expect(screen.getByText('0/100')).toBeInTheDocument()
  })

  it('updates character count on change', () => {
    render(<Textarea showCount maxLength={100} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('shows count without maxLength when showCount is true', () => {
    render(<Textarea showCount />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders helper text', () => {
    render(<Textarea helperText="Max 500 characters" />)
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument()
  })

  it('renders in disabled state', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Textarea label="Description" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Textarea label="Description" error="Required" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

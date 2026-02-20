import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Radio, RadioGroup } from './Radio'

describe('Radio', () => {
  it('renders without crashing', () => {
    render(<Radio name="group" value="a" />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Radio name="group" value="a" label="Option A" />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByRole('radio')).toHaveAccessibleName('Option A')
  })

  it('renders description when provided', () => {
    render(<Radio name="group" value="a" label="Option A" description="First option" />)
    expect(screen.getByText('First option')).toBeInTheDocument()
  })

  it('renders checked state', () => {
    render(<Radio name="group" value="a" label="A" checked onChange={() => {}} />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('renders disabled state', () => {
    render(<Radio name="group" value="a" label="Disabled" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Radio name="group" value="a" label="Option A" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('RadioGroup', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ]

  it('renders all options', () => {
    render(<RadioGroup name="test" options={options} />)
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option C' })).toBeInTheDocument()
  })

  it('renders group label', () => {
    render(<RadioGroup name="test" label="Choose an option" options={options} />)
    expect(screen.getByText('Choose an option')).toBeInTheDocument()
  })

  it('marks correct option as checked', () => {
    render(<RadioGroup name="test" value="b" options={options} onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Option A' })).not.toBeChecked()
  })

  it('calls onChange with value when option is clicked', () => {
    const handleChange = vi.fn()
    render(<RadioGroup name="test" options={options} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Option A' }))
    expect(handleChange).toHaveBeenCalledWith('a')
  })

  it('does not call onChange for disabled option', () => {
    const handleChange = vi.fn()
    render(<RadioGroup name="test" options={options} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Option C' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders disabled option as disabled', () => {
    render(<RadioGroup name="test" options={options} />)
    expect(screen.getByRole('radio', { name: 'Option C' })).toBeDisabled()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <RadioGroup name="test" label="Choose" options={options} value="a" onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

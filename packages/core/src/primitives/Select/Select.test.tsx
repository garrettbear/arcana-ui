import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Select } from './Select'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe('Select', () => {
  it('renders without crashing', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders options from options prop', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument()
  })

  it('renders children as options when no options prop', () => {
    render(
      <Select>
        <option value="x">Child Option X</option>
      </Select>
    )
    expect(screen.getByRole('option', { name: 'Child Option X' })).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Select label="Choose one" options={options} />)
    expect(screen.getByText('Choose one')).toBeInTheDocument()
    const select = screen.getByRole('combobox')
    expect(select).toHaveAccessibleName('Choose one')
  })

  it('renders placeholder option', () => {
    render(<Select placeholder="Pick an option" options={options} />)
    expect(screen.getByRole('option', { name: 'Pick an option' })).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<Select error="Required field" options={options} />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders helper text', () => {
    render(<Select helperText="Select one of the options" options={options} />)
    expect(screen.getByText('Select one of the options')).toBeInTheDocument()
  })

  it('calls onChange handler', () => {
    const handleChange = vi.fn()
    render(<Select options={options} onChange={handleChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders disabled state', () => {
    render(<Select options={options} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Select label="Fruit" options={options} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Select label="Fruit" error="Required" options={options} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

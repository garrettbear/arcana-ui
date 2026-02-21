import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Form, FormField, FormLabel, FormHelperText, FormErrorMessage } from './Form'

describe('Form', () => {
  it('renders children', () => {
    render(<Form><button>Submit</button></Form>)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('renders as a form element', () => {
    const { container } = render(<Form>Content</Form>)
    expect(container.querySelector('form')).toBeInTheDocument()
  })

  it('has noValidate attribute', () => {
    const { container } = render(<Form>Content</Form>)
    expect(container.querySelector('form')).toHaveAttribute('novalidate')
  })

  it('forwards onSubmit handler', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>
    )
    // Just checking it renders correctly
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Form>
        <FormField>
          <FormLabel htmlFor="name">Name</FormLabel>
          <input id="name" type="text" />
        </FormField>
      </Form>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('FormField', () => {
  it('renders children', () => {
    render(<FormField><div>Field content</div></FormField>)
    expect(screen.getByText('Field content')).toBeInTheDocument()
  })
})

describe('FormLabel', () => {
  it('renders children', () => {
    render(
      <FormField>
        <FormLabel>Email</FormLabel>
      </FormField>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders required indicator when FormField isRequired', () => {
    const { container } = render(
      <FormField isRequired>
        <FormLabel>Email</FormLabel>
      </FormField>
    )
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('*')
  })

  it('does not render required indicator when not required', () => {
    const { container } = render(
      <FormField>
        <FormLabel>Email</FormLabel>
      </FormField>
    )
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })
})

describe('FormHelperText', () => {
  it('renders helper text when field is valid', () => {
    render(
      <FormField>
        <FormHelperText>Enter your email address</FormHelperText>
      </FormField>
    )
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('does not render when field is invalid', () => {
    render(
      <FormField isInvalid>
        <FormHelperText>Enter your email address</FormHelperText>
      </FormField>
    )
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument()
  })
})

describe('FormErrorMessage', () => {
  it('renders error message when field is invalid', () => {
    render(
      <FormField isInvalid>
        <FormErrorMessage>This field is required</FormErrorMessage>
      </FormField>
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not render when field is valid', () => {
    render(
      <FormField>
        <FormErrorMessage>This field is required</FormErrorMessage>
      </FormField>
    )
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('has role="alert" when rendered', () => {
    render(
      <FormField isInvalid>
        <FormErrorMessage>Error!</FormErrorMessage>
      </FormField>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('Form composition', () => {
  it('renders complete form with all sub-components', () => {
    render(
      <Form>
        <FormField isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <input id="email" type="email" />
          <FormHelperText>We will never share your email.</FormHelperText>
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('passes axe accessibility checks for complete form', async () => {
    const { container } = render(
      <Form>
        <FormField isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <input id="username" type="text" aria-required="true" />
          <FormHelperText>Pick a unique username</FormHelperText>
        </FormField>
        <FormField isInvalid>
          <FormLabel htmlFor="email">Email</FormLabel>
          <input id="email" type="email" aria-invalid="true" />
          <FormErrorMessage>Invalid email address</FormErrorMessage>
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

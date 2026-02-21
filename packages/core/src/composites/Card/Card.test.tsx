import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Card, CardHeader, CardBody, CardFooter } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders all variants without crashing', () => {
    const variants = ['default', 'outlined', 'elevated'] as const
    for (const variant of variants) {
      const { unmount } = render(<Card variant={variant}>{variant}</Card>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders all padding sizes without crashing', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const
    for (const padding of paddings) {
      const { unmount } = render(<Card padding={padding}>Content</Card>)
      expect(screen.getByText('Content')).toBeInTheDocument()
      unmount()
    }
  })

  it('renders interactive variant without crashing', () => {
    render(<Card interactive>Interactive</Card>)
    expect(screen.getByText('Interactive')).toBeInTheDocument()
  })

  it('forwards additional HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>)
    expect(screen.getByTestId('my-card')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Card>Accessible card</Card>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('CardHeader', () => {
  it('renders title and description', () => {
    render(<CardHeader title="Card Title" description="Card description" />)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<CardHeader title="Title" description="Description" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body content</CardBody>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders all align variants without crashing', () => {
    const aligns = ['left', 'center', 'right', 'space-between'] as const
    for (const align of aligns) {
      const { unmount } = render(<CardFooter align={align}>Footer</CardFooter>)
      expect(screen.getByText('Footer')).toBeInTheDocument()
      unmount()
    }
  })
})

describe('Card composition', () => {
  it('renders complete card with all sub-components', () => {
    render(
      <Card>
        <CardHeader title="Title" description="Description" />
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('passes axe accessibility checks for full card', async () => {
    const { container } = render(
      <Card>
        <CardHeader title="Title" description="Description" />
        <CardBody>Body content</CardBody>
        <CardFooter><button>Submit</button></CardFooter>
      </Card>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

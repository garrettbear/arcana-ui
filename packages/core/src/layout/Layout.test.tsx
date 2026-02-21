import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Stack, HStack, Grid, Container } from './Layout'

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack><div>Item 1</div><div>Item 2</div></Stack>)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('accepts numeric gap', () => {
    const { container } = render(<Stack gap={4}><div>Item</div></Stack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gap).toBe('var(--arcana-spacing-4)')
  })

  it('accepts string gap', () => {
    const { container } = render(<Stack gap="16px"><div>Item</div></Stack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gap).toBe('16px')
  })

  it('applies align style', () => {
    const { container } = render(<Stack align="center"><div>Item</div></Stack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.alignItems).toBe('center')
  })

  it('applies justify style', () => {
    const { container } = render(<Stack justify="space-between"><div>Item</div></Stack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.justifyContent).toBe('space-between')
  })

  it('forwards HTML attributes', () => {
    render(<Stack data-testid="my-stack"><div>Item</div></Stack>)
    expect(screen.getByTestId('my-stack')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Stack><div>Item 1</div><div>Item 2</div></Stack>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('HStack', () => {
  it('renders children', () => {
    render(<HStack><div>A</div><div>B</div></HStack>)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('has default align center', () => {
    const { container } = render(<HStack><div>Item</div></HStack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.alignItems).toBe('center')
  })

  it('accepts numeric gap', () => {
    const { container } = render(<HStack gap={2}><div>Item</div></HStack>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gap).toBe('var(--arcana-spacing-2)')
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<HStack><div>Item 1</div><div>Item 2</div></HStack>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid><div>Cell 1</div><div>Cell 2</div></Grid>)
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
  })

  it('sets numeric columns as grid-template-columns', () => {
    const { container } = render(<Grid columns={3}><div>Item</div></Grid>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  it('sets string columns directly', () => {
    const { container } = render(<Grid columns="200px 1fr"><div>Item</div></Grid>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('200px 1fr')
  })

  it('applies numeric gap', () => {
    const { container } = render(<Grid gap={4}><div>Item</div></Grid>)
    const el = container.firstChild as HTMLElement
    expect(el.style.gap).toBe('var(--arcana-spacing-4)')
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Grid columns={2}><div>A</div><div>B</div></Grid>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('sets maxWidth based on size', () => {
    const { container } = render(<Container size="sm">Content</Container>)
    const el = container.firstChild as HTMLElement
    expect(el.style.maxWidth).toBe('640px')
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
    for (const size of sizes) {
      const { unmount } = render(<Container size={size}>Content</Container>)
      expect(screen.getByText('Content')).toBeInTheDocument()
      unmount()
    }
  })

  it('forwards HTML attributes', () => {
    render(<Container data-testid="container">Content</Container>)
    expect(screen.getByTestId('container')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Container>Content</Container>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

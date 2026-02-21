import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Navbar, NavbarBrand, NavbarContent, NavbarActions } from './Navbar'

describe('Navbar', () => {
  it('renders children', () => {
    render(<Navbar>Nav content</Navbar>)
    expect(screen.getByText('Nav content')).toBeInTheDocument()
  })

  it('renders as a header element', () => {
    const { container } = render(<Navbar>Nav</Navbar>)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders sticky variant without crashing', () => {
    const { container } = render(<Navbar sticky>Nav</Navbar>)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders with border without crashing', () => {
    const { container } = render(<Navbar border>Nav</Navbar>)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('forwards HTML attributes', () => {
    render(<Navbar data-testid="navbar">Nav</Navbar>)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Navbar>
        <NavbarBrand>Brand</NavbarBrand>
        <NavbarContent>
          <a href="#">Home</a>
        </NavbarContent>
        <NavbarActions>
          <button>Sign in</button>
        </NavbarActions>
      </Navbar>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('NavbarBrand', () => {
  it('renders children', () => {
    render(<NavbarBrand>My App</NavbarBrand>)
    expect(screen.getByText('My App')).toBeInTheDocument()
  })
})

describe('NavbarContent', () => {
  it('renders children', () => {
    render(
      <NavbarContent>
        <a href="#">Link</a>
      </NavbarContent>
    )
    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument()
  })

  it('renders as a nav element with aria-label', () => {
    const { container } = render(<NavbarContent><a href="#">Link</a></NavbarContent>)
    expect(container.querySelector('nav[aria-label="Main navigation"]')).toBeInTheDocument()
  })
})

describe('NavbarActions', () => {
  it('renders children', () => {
    render(<NavbarActions><button>Click</button></NavbarActions>)
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument()
  })
})

describe('Navbar composition', () => {
  it('renders full navbar composition', () => {
    render(
      <Navbar>
        <NavbarBrand>Logo</NavbarBrand>
        <NavbarContent>
          <a href="#">About</a>
        </NavbarContent>
        <NavbarActions>
          <button>Login</button>
        </NavbarActions>
      </Navbar>
    )
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
})

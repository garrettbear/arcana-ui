import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Modal } from './Modal'

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Test Modal" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open is true', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Test Modal" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Modal" />)
    expect(screen.getByText('My Modal')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" description="Modal description" />)
    expect(screen.getByText('Modal description')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        <p>Modal body content</p>
      </Modal>
    )
    expect(screen.getByText('Modal body content')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title" footer={<button>OK</button>} />
    )
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose} title="Title" />)
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked by default', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal open={true} onClose={onClose} title="Title" />)
    // Click on the overlay (the parent div of the dialog)
    const overlay = container.querySelector('[aria-hidden="false"]')
    if (overlay) fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose on overlay click when closeOnOverlayClick is false', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open={true} onClose={onClose} title="Title" closeOnOverlayClick={false} />
    )
    const overlay = container.querySelector('[aria-hidden="false"]')
    if (overlay) fireEvent.click(overlay)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
    for (const size of sizes) {
      const { unmount } = render(<Modal open={true} onClose={vi.fn()} title="Title" size={size} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      unmount()
    }
  })

  it('has aria-modal attribute', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing to title', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Title" />)
    const dialog = screen.getByRole('dialog')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const titleEl = document.getElementById(labelledBy!)
    expect(titleEl).toHaveTextContent('My Title')
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Modal open={true} onClose={vi.fn()} title="Accessible Modal" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with description', async () => {
    const { container } = render(
      <Modal open={true} onClose={vi.fn()} title="Title" description="Description text">
        <p>Content</p>
      </Modal>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

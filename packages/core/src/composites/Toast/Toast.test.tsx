import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ToastProvider, useToast } from './Toast'

// Helper component to trigger toasts
function ToastTrigger({ options }: { options: Parameters<ReturnType<typeof useToast>['toast']>[0] }) {
  const { toast } = useToast()
  return <button onClick={() => toast(options)}>Show Toast</button>
}

function renderWithToast(options: Parameters<ReturnType<typeof useToast>['toast']>[0]) {
  return render(
    <ToastProvider>
      <ToastTrigger options={options} />
    </ToastProvider>
  )
}

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>Child content</div>
      </ToastProvider>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('shows toast when triggered', async () => {
    renderWithToast({ title: 'Hello Toast' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    expect(screen.getByText('Hello Toast')).toBeInTheDocument()
  })

  it('shows toast with description', async () => {
    renderWithToast({ title: 'Toast Title', description: 'Toast description' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    expect(screen.getByText('Toast Title')).toBeInTheDocument()
    expect(screen.getByText('Toast description')).toBeInTheDocument()
  })

  it('shows toast with action button', async () => {
    const actionClick = vi.fn()
    renderWithToast({
      title: 'Toast with action',
      action: { label: 'Undo', onClick: actionClick },
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })

  it('calls action onClick when action button is clicked', async () => {
    const actionClick = vi.fn()
    renderWithToast({
      title: 'Toast',
      action: { label: 'Undo', onClick: actionClick },
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(actionClick).toHaveBeenCalledTimes(1)
  })

  it('dismisses toast when dismiss button is clicked', async () => {
    renderWithToast({ title: 'Dismiss me' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    expect(screen.getByText('Dismiss me')).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
      await new Promise((r) => setTimeout(r, 350))
    })
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument()
  })

  it('passes axe accessibility checks with toast shown', async () => {
    const { container } = render(
      <ToastProvider>
        <ToastTrigger options={{ title: 'Accessible Toast' }} />
      </ToastProvider>
    )
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('useToast', () => {
  it('throws when used outside ToastProvider', () => {
    // Suppress console.error for this expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function BadComponent() {
      useToast()
      return null
    }
    expect(() => render(<BadComponent />)).toThrow('useToast must be used within ToastProvider')
    consoleSpy.mockRestore()
  })
})

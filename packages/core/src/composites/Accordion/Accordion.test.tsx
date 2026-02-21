import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

function BasicAccordion({ type = 'single' as const, defaultValue }: { type?: 'single' | 'multiple'; defaultValue?: string }) {
  return (
    <Accordion type={type} defaultValue={defaultValue}>
      <AccordionItem value="item1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item3" disabled>
        <AccordionTrigger>Item 3 (disabled)</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('renders all triggers', () => {
    render(<BasicAccordion />)
    expect(screen.getByRole('button', { name: 'Item 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Item 2' })).toBeInTheDocument()
  })

  it('content is hidden by default', () => {
    render(<BasicAccordion />)
    expect(screen.queryByText('Content 1')).not.toBeVisible()
    expect(screen.queryByText('Content 2')).not.toBeVisible()
  })

  it('opens item when trigger is clicked', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Item 1' }))
    expect(screen.getByText('Content 1')).toBeVisible()
  })

  it('closes open item when trigger is clicked again (single mode)', () => {
    render(<BasicAccordion defaultValue="item1" />)
    expect(screen.getByText('Content 1')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Item 1' }))
    expect(screen.getByText('Content 1')).not.toBeVisible()
  })

  it('closes previously open item when another is opened (single mode)', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Item 1' }))
    expect(screen.getByText('Content 1')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Item 2' }))
    expect(screen.getByText('Content 1')).not.toBeVisible()
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('allows multiple items open in multiple mode', () => {
    render(<BasicAccordion type="multiple" />)
    fireEvent.click(screen.getByRole('button', { name: 'Item 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Item 2' }))
    expect(screen.getByText('Content 1')).toBeVisible()
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('trigger has aria-expanded="false" when closed', () => {
    render(<BasicAccordion />)
    expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('trigger has aria-expanded="true" when open', () => {
    render(<BasicAccordion defaultValue="item1" />)
    expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('disabled item cannot be opened', () => {
    render(<BasicAccordion />)
    fireEvent.click(screen.getByRole('button', { name: 'Item 3 (disabled)' }))
    expect(screen.getByText('Content 3')).not.toBeVisible()
  })

  it('renders with defaultValue open', () => {
    render(<BasicAccordion defaultValue="item2" />)
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<BasicAccordion />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with item open', async () => {
    const { container } = render(<BasicAccordion defaultValue="item1" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

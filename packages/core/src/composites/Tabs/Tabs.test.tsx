import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from './Tabs'

function BasicTabs({ defaultValue = 'tab1', onChange }: { defaultValue?: string; onChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue={defaultValue} onChange={onChange}>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3" disabled>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
        <TabPanel value="tab3">Panel 3</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders tabs and panels', () => {
    render(<BasicTabs />)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
  })

  it('shows the default active panel', () => {
    render(<BasicTabs defaultValue="tab1" />)
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument()
  })

  it('switches panel when a tab is clicked', () => {
    render(<BasicTabs />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument()
  })

  it('calls onChange when tab is clicked', () => {
    const onChange = vi.fn()
    render(<BasicTabs onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(onChange).toHaveBeenCalledWith('tab2')
  })

  it('disabled tab cannot be clicked', () => {
    const onChange = vi.fn()
    render(<BasicTabs onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }))
    expect(onChange).not.toHaveBeenCalledWith('tab3')
  })

  it('active tab has aria-selected="true"', () => {
    render(<BasicTabs defaultValue="tab1" />)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false')
  })

  it('renders pills variant without crashing', () => {
    render(
      <Tabs defaultValue="a" variant="pills">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabPanels>
      </Tabs>
    )
    expect(screen.getByRole('tab', { name: 'A' })).toBeInTheDocument()
  })

  it('panel has correct aria-labelledby', () => {
    render(<BasicTabs defaultValue="tab1" />)
    const panel = screen.getByRole('tabpanel')
    const labelledBy = panel.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const tab = document.getElementById(labelledBy!)
    expect(tab).toHaveTextContent('Tab 1')
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<BasicTabs />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with pills variant', async () => {
    const { container } = render(
      <Tabs defaultValue="a" variant="pills">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="a">Panel A</TabPanel>
        </TabPanels>
      </Tabs>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

import React, { createContext, useContext, useId, useState } from 'react'
import { cn } from '../../utils/cn'
import styles from './Tabs.module.css'

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeValue: string
  setActiveValue: (value: string) => void
  variant: 'line' | 'pills'
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>')
  return ctx
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabsProps {
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  variant?: 'line' | 'pills'
  children: React.ReactNode
  className?: string
}

export const Tabs = ({ value, onChange, defaultValue = '', variant = 'line', children, className }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const baseId = useId()

  const activeValue = value !== undefined ? value : internalValue
  const setActiveValue = (v: string) => {
    if (value === undefined) setInternalValue(v)
    onChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, variant, baseId }}>
      <div className={cn(styles.tabs, className)}>{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = 'Tabs'

// ─── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps {
  children: React.ReactNode
  className?: string
}

export const TabList = ({ children, className }: TabListProps) => {
  const { variant } = useTabsContext()
  return (
    <div
      role="tablist"
      className={cn(styles.tabList, variant === 'pills' && styles.tabListPills, className)}
    >
      {children}
    </div>
  )
}
TabList.displayName = 'TabList'

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const Tab = ({ value, disabled = false, children, className }: TabProps) => {
  const { activeValue, setActiveValue, variant, baseId } = useTabsContext()
  const isActive = activeValue === value
  const panelId = `${baseId}-panel-${value}`
  const tabId = `${baseId}-tab-${value}`

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) setActiveValue(value)
    }
  }

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActiveValue(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        styles.tab,
        variant === 'pills' ? styles.tabPill : styles.tabLine,
        isActive && (variant === 'pills' ? styles.tabPillActive : styles.tabLineActive),
        disabled && styles.tabDisabled,
        className
      )}
    >
      {children}
    </button>
  )
}
Tab.displayName = 'Tab'

// ─── TabPanels ────────────────────────────────────────────────────────────────

export interface TabPanelsProps {
  children: React.ReactNode
  className?: string
}

export const TabPanels = ({ children, className }: TabPanelsProps) => {
  return <div className={cn(styles.tabPanels, className)}>{children}</div>
}
TabPanels.displayName = 'TabPanels'

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const { activeValue, baseId } = useTabsContext()
  const isActive = activeValue === value
  const panelId = `${baseId}-panel-${value}`
  const tabId = `${baseId}-tab-${value}`

  if (!isActive) return null

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn(styles.tabPanel, className)}
    >
      {children}
    </div>
  )
}
TabPanel.displayName = 'TabPanel'

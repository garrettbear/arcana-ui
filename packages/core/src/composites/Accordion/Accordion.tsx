import React, { createContext, useContext, useId, useState } from 'react'
import { cn } from '../../utils/cn'
import styles from './Accordion.module.css'

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  openValues: string[]
  toggle: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
  disabled: boolean
  triggerId: string
  panelId: string
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>')
  return ctx
}

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error('AccordionTrigger/Content must be used within <AccordionItem>')
  return ctx
}

// ─── Accordion ────────────────────────────────────────────────────────────────

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

export const Accordion = ({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) => {
  const [openValues, setOpenValues] = useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggle = (value: string) => {
    setOpenValues((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      } else {
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      }
    })
  }

  return (
    <AccordionContext.Provider value={{ openValues, toggle, type }}>
      <div className={cn(styles.accordion, className)}>{children}</div>
    </AccordionContext.Provider>
  )
}
Accordion.displayName = 'Accordion'

// ─── AccordionItem ────────────────────────────────────────────────────────────

export interface AccordionItemProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const AccordionItem = ({ value, disabled = false, children, className }: AccordionItemProps) => {
  const { openValues } = useAccordion()
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const panelId = `${baseId}-panel`
  const isOpen = openValues.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled, triggerId, panelId }}>
      <div className={cn(styles.item, isOpen && styles.itemOpen, disabled && styles.itemDisabled, className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}
AccordionItem.displayName = 'AccordionItem'

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export const AccordionTrigger = ({ children, className }: AccordionTriggerProps) => {
  const { toggle } = useAccordion()
  const { value, isOpen, disabled, triggerId, panelId } = useAccordionItem()

  return (
    <h3 className={styles.triggerHeading}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => !disabled && toggle(value)}
        className={cn(styles.trigger, className)}
      >
        <span className={styles.triggerContent}>{children}</span>
        <span className={cn(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    </h3>
  )
}
AccordionTrigger.displayName = 'AccordionTrigger'

// ─── AccordionContent ─────────────────────────────────────────────────────────

export interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export const AccordionContent = ({ children, className }: AccordionContentProps) => {
  const { isOpen, triggerId, panelId } = useAccordionItem()

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      className={cn(styles.content, isOpen && styles.contentOpen, className)}
    >
      <div className={styles.contentInner}>{children}</div>
    </div>
  )
}
AccordionContent.displayName = 'AccordionContent'

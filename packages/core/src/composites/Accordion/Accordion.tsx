import React, { createContext, useContext, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Accordion.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
  return ctx;
}

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('AccordionTrigger/Content must be used within <AccordionItem>');
  return ctx;
}

// ─── Accordion ────────────────────────────────────────────────────────────────

export interface AccordionProps {
  /** Whether one or multiple items can be open at once */
  type?: 'single' | 'multiple';
  /** Default open item value(s) for uncontrolled mode */
  defaultValue?: string | string[];
  /** Controlled open item value(s) */
  value?: string | string[];
  /** Callback fired when the open items change */
  onChange?: (value: string | string[]) => void;
  /** AccordionItem elements */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, value, onChange, children, className }, ref) => {
    const [internalValues, setInternalValues] = useState<string[]>(() => {
      if (!defaultValue) return [];
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });

    const isControlled = value !== undefined;
    const openValues = isControlled
      ? Array.isArray(value)
        ? value
        : value
          ? [value]
          : []
      : internalValues;

    const toggle = (itemValue: string) => {
      const next =
        type === 'single'
          ? openValues.includes(itemValue)
            ? []
            : [itemValue]
          : openValues.includes(itemValue)
            ? openValues.filter((v) => v !== itemValue)
            : [...openValues, itemValue];

      if (!isControlled) {
        setInternalValues(next);
      }
      onChange?.(type === 'single' ? (next[0] ?? '') : next);
    };

    return (
      <AccordionContext.Provider value={{ openValues, toggle, type }}>
        <div ref={ref} className={cn(styles.accordion, className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

// ─── AccordionItem ────────────────────────────────────────────────────────────

export interface AccordionItemProps {
  /** Unique identifier for this item */
  value: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** AccordionTrigger and AccordionContent elements */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, children, className }, ref) => {
    const { openValues } = useAccordion();
    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;
    const isOpen = openValues.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, disabled, triggerId, panelId }}>
        <div
          ref={ref}
          className={cn(
            styles.item,
            isOpen && styles.itemOpen,
            disabled && styles.itemDisabled,
            className,
          )}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export interface AccordionTriggerProps {
  /** Trigger label content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className }, ref) => {
    const { toggle } = useAccordion();
    const { value, isOpen, disabled, triggerId, panelId } = useAccordionItem();

    return (
      <h3 className={styles.triggerHeading}>
        <button
          ref={ref}
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
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </h3>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

// ─── AccordionContent ─────────────────────────────────────────────────────────

export interface AccordionContentProps {
  /** Collapsible panel content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className }, ref) => {
    const { isOpen, triggerId, panelId } = useAccordionItem();

    return (
      <div
        ref={ref}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className={cn(styles.content, isOpen && styles.contentOpen, className)}
      >
        <div className={styles.contentInner}>{children}</div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

import React, { createContext, useContext, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Tabs.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  variant: 'line' | 'pills';
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>');
  return ctx;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabsProps {
  /** Controlled active tab value */
  value?: string;
  /** Callback fired when the active tab changes */
  onChange?: (value: string) => void;
  /** Default active tab value for uncontrolled mode */
  defaultValue?: string;
  /** Visual style variant */
  variant?: 'line' | 'pills';
  /** Tab compound components */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onChange, defaultValue = '', variant = 'line', children, className }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const baseId = useId();

    const activeValue = value !== undefined ? value : internalValue;
    const setActiveValue = (v: string) => {
      if (value === undefined) setInternalValue(v);
      onChange?.(v);
    };

    return (
      <TabsContext.Provider value={{ activeValue, setActiveValue, variant, baseId }}>
        <div ref={ref} className={cn(styles.tabs, className)}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

// ─── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps {
  /** Tab button elements */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className }, ref) => {
    const { variant } = useTabsContext();
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(styles.tabList, variant === 'pills' && styles.tabListPills, className)}
      >
        {children}
      </div>
    );
  },
);
TabList.displayName = 'TabList';

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps {
  /** Unique identifier for this tab */
  value: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Tab label content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, disabled = false, children, className }, ref) => {
    const { activeValue, setActiveValue, variant, baseId } = useTabsContext();
    const isActive = activeValue === value;
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled) setActiveValue(value);
      }
    };

    return (
      <button
        ref={ref}
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
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
Tab.displayName = 'Tab';

// ─── TabPanels ────────────────────────────────────────────────────────────────

export interface TabPanelsProps {
  /** TabPanel elements */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const TabPanels = React.forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn(styles.tabPanels, className)}>
        {children}
      </div>
    );
  },
);
TabPanels.displayName = 'TabPanels';

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps {
  /** Value matching the corresponding Tab */
  value: string;
  /** Panel content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, children, className }, ref) => {
    const { activeValue, baseId } = useTabsContext();
    const isActive = activeValue === value;
    const panelId = `${baseId}-panel-${value}`;
    const tabId = `${baseId}-tab-${value}`;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        className={cn(styles.tabPanel, className)}
      >
        {children}
      </div>
    );
  },
);
TabPanel.displayName = 'TabPanel';

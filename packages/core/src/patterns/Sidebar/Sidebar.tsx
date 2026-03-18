import React, { createContext, useContext } from 'react';
import { cn } from '../../utils/cn';
import styles from './Sidebar.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  collapsed: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false });

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the sidebar is collapsed to icon-only mode */
  collapsed?: boolean;
  /** Position of the sidebar */
  position?: 'left' | 'right';
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed = false, position = 'left', children, className, ...props }, ref) => {
    return (
      <SidebarContext.Provider value={{ collapsed }}>
        <aside
          ref={ref}
          className={cn(
            styles.sidebar,
            collapsed && styles.collapsed,
            position === 'right' && styles.right,
            className,
          )}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    );
  },
);
Sidebar.displayName = 'Sidebar';

// ─── SidebarHeader ────────────────────────────────────────────────────────────

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarHeader.displayName = 'SidebarHeader';

// ─── SidebarContent ───────────────────────────────────────────────────────────

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarContent.displayName = 'SidebarContent';

// ─── SidebarFooter ────────────────────────────────────────────────────────────

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  },
);
SidebarFooter.displayName = 'SidebarFooter';

// ─── SidebarItem ──────────────────────────────────────────────────────────────

export interface SidebarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Icon element displayed before the label */
  icon?: React.ReactNode;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Render as an anchor element instead of button */
  href?: string;
  /** Badge count or text displayed on the right */
  badge?: string | number;
}

export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ icon, active = false, disabled = false, href, badge, children, className, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext);

    const content = (
      <>
        {icon && (
          <span className={styles.itemIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        {!collapsed && <span className={styles.itemLabel}>{children}</span>}
        {badge !== undefined && !collapsed && <span className={styles.itemBadge}>{badge}</span>}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            styles.item,
            active && styles.itemActive,
            disabled && styles.itemDisabled,
            className,
          )}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.item,
          active && styles.itemActive,
          disabled && styles.itemDisabled,
          className,
        )}
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {content}
      </button>
    );
  },
);
SidebarItem.displayName = 'SidebarItem';

// ─── SidebarSection ───────────────────────────────────────────────────────────

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading label */
  label?: string;
}

export const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ label, children, className, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext);

    return (
      <div ref={ref} className={cn(styles.section, className)} {...props}>
        {label && !collapsed && <span className={styles.sectionLabel}>{label}</span>}
        <nav>{children}</nav>
      </div>
    );
  },
);
SidebarSection.displayName = 'SidebarSection';

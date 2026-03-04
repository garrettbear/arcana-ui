import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Navbar.module.css';

// ─── Navbar ───────────────────────────────────────────────────────────────────

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the navbar sticks to the top of the viewport */
  sticky?: boolean;
  /** Whether to show a bottom border */
  border?: boolean;
  /** Navbar content (NavbarBrand, NavbarContent, NavbarActions) */
  children?: React.ReactNode;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ sticky = false, border = false, children, className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(styles.navbar, sticky && styles.sticky, border && styles.border, className)}
        {...props}
      >
        <div className={styles.inner}>{children}</div>
      </header>
    );
  },
);
Navbar.displayName = 'Navbar';

// ─── NavbarBrand ──────────────────────────────────────────────────────────────

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand logo or name content */
  children?: React.ReactNode;
}

export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.brand, className)} {...props}>
        {children}
      </div>
    );
  },
);
NavbarBrand.displayName = 'NavbarBrand';

// ─── NavbarContent ────────────────────────────────────────────────────────────

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Navigation links or other content */
  children?: React.ReactNode;
}

export const NavbarContent = React.forwardRef<HTMLElement, NavbarContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(styles.content, className)}
        aria-label="Main navigation"
        {...props}
      >
        {children}
      </nav>
    );
  },
);
NavbarContent.displayName = 'NavbarContent';

// ─── NavbarActions ────────────────────────────────────────────────────────────

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action buttons or controls */
  children?: React.ReactNode;
}

export const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.actions, className)} {...props}>
        {children}
      </div>
    );
  },
);
NavbarActions.displayName = 'NavbarActions';

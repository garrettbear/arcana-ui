import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import styles from './Navbar.module.css';

// ─── Navbar ───────────────────────────────────────────────────────────────────

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the navbar sticks to the top of the viewport */
  sticky?: boolean;
  /** Whether to show a bottom border */
  border?: boolean;
  /** Content for the mobile menu panel (NavbarContent/NavbarActions rendered vertically) */
  mobileContent?: React.ReactNode;
  /** Navbar content (NavbarBrand, NavbarContent, NavbarActions) */
  children?: React.ReactNode;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ sticky = false, border = false, mobileContent, children, className, ...props }, ref) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

    return (
      <header
        ref={ref}
        className={cn(styles.navbar, sticky && styles.sticky, border && styles.border, className)}
        {...props}
      >
        <div className={styles.inner}>
          {children}
          {mobileContent && (
            <button
              type="button"
              className={styles.mobileToggle}
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="14" x2="20" y2="14" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
        {mobileContent && mobileOpen && <div className={styles.mobilePanel}>{mobileContent}</div>}
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

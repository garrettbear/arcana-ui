import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Navbar.module.css'

// ─── Navbar ───────────────────────────────────────────────────────────────────

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean
  border?: boolean
  children?: React.ReactNode
}

export const Navbar = ({ sticky = false, border = false, children, className, ...props }: NavbarProps) => {
  return (
    <header
      className={cn(
        styles.navbar,
        sticky && styles.sticky,
        border && styles.border,
        className
      )}
      {...props}
    >
      <div className={styles.inner}>{children}</div>
    </header>
  )
}
Navbar.displayName = 'Navbar'

// ─── NavbarBrand ──────────────────────────────────────────────────────────────

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const NavbarBrand = ({ children, className, ...props }: NavbarBrandProps) => {
  return (
    <div className={cn(styles.brand, className)} {...props}>
      {children}
    </div>
  )
}
NavbarBrand.displayName = 'NavbarBrand'

// ─── NavbarContent ────────────────────────────────────────────────────────────

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const NavbarContent = ({ children, className, ...props }: NavbarContentProps) => {
  return (
    <nav className={cn(styles.content, className)} aria-label="Main navigation" {...props}>
      {children}
    </nav>
  )
}
NavbarContent.displayName = 'NavbarContent'

// ─── NavbarActions ────────────────────────────────────────────────────────────

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const NavbarActions = ({ children, className, ...props }: NavbarActionsProps) => {
  return (
    <div className={cn(styles.actions, className)} {...props}>
      {children}
    </div>
  )
}
NavbarActions.displayName = 'NavbarActions'

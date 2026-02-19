import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Badge.module.css'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
  dot?: boolean
  children?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', dot = false, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.badge, styles[variant], className)}
        {...props}
      >
        {dot && <span className={styles.dot} aria-hidden="true" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

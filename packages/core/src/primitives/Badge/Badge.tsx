import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to display a status dot indicator */
  dot?: boolean;
  /** Badge content */
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.badge, styles[variant], styles[`size-${size}`], className)}
        {...props}
      >
        {dot && <span className={styles.dot} aria-hidden="true" />}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

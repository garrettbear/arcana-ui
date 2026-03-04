import React from 'react';
import { cn } from '../../utils/cn';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /** Icon element displayed above the title */
  icon?: React.ReactNode;
  /** Primary message text */
  title: string;
  /** Secondary descriptive text */
  description?: string;
  /** Call-to-action element (e.g., a Button) */
  action?: React.ReactNode;
  /** Size variant affecting spacing and typography */
  size?: 'sm' | 'md';
  /** Additional CSS class name */
  className?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, size = 'md', className }, ref) => {
    return (
      <div ref={ref} className={cn(styles.emptyState, styles[size], className)}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    );
  },
);
EmptyState.displayName = 'EmptyState';

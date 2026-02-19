import React from 'react'
import { cn } from '../../utils/cn'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export const EmptyState = ({ icon, title, description, action, size = 'md', className }: EmptyStateProps) => {
  return (
    <div className={cn(styles.emptyState, styles[size], className)}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
EmptyState.displayName = 'EmptyState'

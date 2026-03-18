import React from 'react';
import { cn } from '../../utils/cn';
import styles from './StatsBar.module.css';

// ─── StatsBar ────────────────────────────────────────────────────────────────

export interface StatsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: 2 | 3 | 4;
}

export const StatsBar = React.forwardRef<HTMLDivElement, StatsBarProps>(
  ({ columns = 3, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.bar, styles[`cols${columns}`], className)} {...props}>
        {children}
      </div>
    );
  },
);
StatsBar.displayName = 'StatsBar';

// ─── StatItem ────────────────────────────────────────────────────────────────

export interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The stat value (e.g., "10K+") */
  value: string;
  /** Label describing the stat */
  label: string;
}

export const StatItem = React.forwardRef<HTMLDivElement, StatItemProps>(
  ({ value, label, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.item, className)} {...props}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    );
  },
);
StatItem.displayName = 'StatItem';

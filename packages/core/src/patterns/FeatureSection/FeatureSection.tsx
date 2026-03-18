import React from 'react';
import { cn } from '../../utils/cn';
import styles from './FeatureSection.module.css';

// ─── FeatureSection ──────────────────────────────────────────────────────────

export interface FeatureSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of columns in the feature grid */
  columns?: 2 | 3 | 4;
}

export const FeatureSection = React.forwardRef<HTMLElement, FeatureSectionProps>(
  ({ columns = 3, children, className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn(styles.section, className)} {...props}>
        <div className={cn(styles.grid, styles[`cols${columns}`])}>{children}</div>
      </section>
    );
  },
);
FeatureSection.displayName = 'FeatureSection';

// ─── FeatureItem ─────────────────────────────────────────────────────────────

export interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element displayed above the title */
  icon?: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
}

export const FeatureItem = React.forwardRef<HTMLDivElement, FeatureItemProps>(
  ({ icon, title, description, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.item, className)} {...props}>
        {icon && (
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    );
  },
);
FeatureItem.displayName = 'FeatureItem';

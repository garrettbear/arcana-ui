import React from 'react';
import { cn } from '../../utils/cn';
import styles from './CTA.module.css';

// ─── CTA ─────────────────────────────────────────────────────────────────────

export interface CTAProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual variant */
  variant?: 'default' | 'filled';
  /** Text alignment */
  align?: 'left' | 'center';
}

export const CTA = React.forwardRef<HTMLElement, CTAProps>(
  ({ variant = 'default', align = 'center', children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          styles.cta,
          variant === 'filled' && styles.filled,
          align === 'left' && styles.alignLeft,
          className,
        )}
        {...props}
      >
        <div className={styles.inner}>{children}</div>
      </section>
    );
  },
);
CTA.displayName = 'CTA';

// ─── CTATitle ────────────────────────────────────────────────────────────────

export interface CTATitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: 'h2' | 'h3' | 'h4';
}

export const CTATitle = React.forwardRef<HTMLHeadingElement, CTATitleProps>(
  ({ as: Tag = 'h2', children, className, ...props }, ref) => {
    return (
      <Tag ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </Tag>
    );
  },
);
CTATitle.displayName = 'CTATitle';

// ─── CTADescription ──────────────────────────────────────────────────────────

export interface CTADescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CTADescription = React.forwardRef<HTMLParagraphElement, CTADescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    );
  },
);
CTADescription.displayName = 'CTADescription';

// ─── CTAActions ──────────────────────────────────────────────────────────────

export interface CTAActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CTAActions = React.forwardRef<HTMLDivElement, CTAActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.actions, className)} {...props}>
        {children}
      </div>
    );
  },
);
CTAActions.displayName = 'CTAActions';

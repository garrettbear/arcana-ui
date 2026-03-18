import React from 'react';
import { cn } from '../../utils/cn';
import styles from './PricingCard.module.css';

// ─── PricingCard ─────────────────────────────────────────────────────────────

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether this plan is highlighted / recommended */
  featured?: boolean;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ featured = false, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.card, featured && styles.featured, className)} {...props}>
        {children}
      </div>
    );
  },
);
PricingCard.displayName = 'PricingCard';

// ─── PricingCardHeader ───────────────────────────────────────────────────────

export interface PricingCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name */
  plan: string;
  /** Short plan description */
  description?: string;
}

export const PricingCardHeader = React.forwardRef<HTMLDivElement, PricingCardHeaderProps>(
  ({ plan, description, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        <h3 className={styles.plan}>{plan}</h3>
        {description && <p className={styles.planDescription}>{description}</p>}
        {children}
      </div>
    );
  },
);
PricingCardHeader.displayName = 'PricingCardHeader';

// ─── PricingCardPrice ────────────────────────────────────────────────────────

export interface PricingCardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Price amount (e.g., "$29") */
  amount: string;
  /** Billing period (e.g., "/month") */
  period?: string;
}

export const PricingCardPrice = React.forwardRef<HTMLDivElement, PricingCardPriceProps>(
  ({ amount, period, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.price, className)} {...props}>
        <span className={styles.amount}>{amount}</span>
        {period && <span className={styles.period}>{period}</span>}
      </div>
    );
  },
);
PricingCardPrice.displayName = 'PricingCardPrice';

// ─── PricingCardFeatures ─────────────────────────────────────────────────────

export interface PricingCardFeaturesProps extends React.HTMLAttributes<HTMLUListElement> {}

export const PricingCardFeatures = React.forwardRef<HTMLUListElement, PricingCardFeaturesProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn(styles.features, className)} {...props}>
        {children}
      </ul>
    );
  },
);
PricingCardFeatures.displayName = 'PricingCardFeatures';

// ─── PricingCardFeature ──────────────────────────────────────────────────────

export interface PricingCardFeatureProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Whether this feature is included */
  included?: boolean;
}

export const PricingCardFeature = React.forwardRef<HTMLLIElement, PricingCardFeatureProps>(
  ({ included = true, children, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(styles.feature, !included && styles.featureExcluded, className)}
        {...props}
      >
        <span className={styles.featureCheck} aria-hidden="true">
          {included ? '\u2713' : '\u2717'}
        </span>
        {children}
      </li>
    );
  },
);
PricingCardFeature.displayName = 'PricingCardFeature';

// ─── PricingCardAction ───────────────────────────────────────────────────────

export interface PricingCardActionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PricingCardAction = React.forwardRef<HTMLDivElement, PricingCardActionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.action, className)} {...props}>
        {children}
      </div>
    );
  },
);
PricingCardAction.displayName = 'PricingCardAction';

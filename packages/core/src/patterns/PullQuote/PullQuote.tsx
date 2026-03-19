import React from 'react';
import { cn } from '../../utils/cn';
import styles from './PullQuote.module.css';

export interface PullQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  /** Quote text */
  quote: string;
  /** Attribution text */
  attribution?: string;
  /** Visual variant */
  variant?: 'default' | 'accent' | 'large';
  /** Additional CSS class */
  className?: string;
}

export const PullQuote = React.forwardRef<HTMLQuoteElement, PullQuoteProps>(
  ({ quote, attribution, variant = 'default', className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(styles.pullquote, styles[`variant-${variant}`], className)}
      {...props}
    >
      <p className={styles.quote}>{quote}</p>
      {attribution && (
        <footer className={styles.footer}>
          <cite className={styles.attribution}>{attribution}</cite>
        </footer>
      )}
    </blockquote>
  ),
);
PullQuote.displayName = 'PullQuote';

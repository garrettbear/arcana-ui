import type React from 'react';
import { forwardRef, useMemo } from 'react';
import { cn } from '../../utils/cn';
import styles from './PriceDisplay.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Price value to display */
  value: number;
  /** Original price before discount (renders struck-through when provided) */
  originalValue?: number;
  /** ISO 4217 currency code */
  currency?: string;
  /** BCP 47 locale string for formatting */
  locale?: string;
  /** Size of the price text */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

// ─── Component ──────────────────────────────────────────────────────────────

export const PriceDisplay = forwardRef<HTMLDivElement, PriceDisplayProps>(
  (
    { value, originalValue, currency = 'USD', locale = 'en-US', size = 'md', className, ...rest },
    ref,
  ) => {
    const formattedValue = useMemo(
      () => formatPrice(value, currency, locale),
      [value, currency, locale],
    );

    const formattedOriginal = useMemo(
      () => (originalValue != null ? formatPrice(originalValue, currency, locale) : null),
      [originalValue, currency, locale],
    );

    const isSale = originalValue != null && originalValue > value;

    const ariaLabel = isSale
      ? `${formattedValue}, reduced from ${formattedOriginal}`
      : formattedValue;

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        role="group"
        className={cn(styles.price, styles[`size-${size}`], className)}
        aria-label={ariaLabel}
        {...rest}
      >
        {isSale && formattedOriginal && (
          <span className={styles.original} aria-hidden="true">
            <s>{formattedOriginal}</s>
          </span>
        )}
        <span className={cn(styles.current, isSale && styles.sale)} aria-hidden="true">
          {formattedValue}
        </span>
      </span>
    );
  },
);

PriceDisplay.displayName = 'PriceDisplay';

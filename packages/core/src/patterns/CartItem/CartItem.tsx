import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { QuantitySelector } from '../QuantitySelector';
import styles from './CartItem.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CartItemProps {
  /** URL of the product image */
  image: string;
  /** Product title */
  title: string;
  /** Product variant description (e.g., "Size M, Blue") */
  variant?: string;
  /** Price as a number */
  price: number;
  /** Current quantity */
  quantity: number;
  /** Currency symbol or code */
  currency?: string;
  /** Callback fired when quantity changes */
  onQuantityChange: (quantity: number) => void;
  /** Callback fired when the remove button is clicked */
  onRemove: () => void;
  /** Maximum allowed quantity */
  maxQuantity?: number;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const CartItem = React.forwardRef<HTMLDivElement, CartItemProps>(
  (
    {
      image,
      title,
      variant,
      price,
      quantity,
      currency = '$',
      onQuantityChange,
      onRemove,
      maxQuantity = 99,
      className,
      ...props
    },
    ref,
  ) => {
    const formattedPrice = useMemo(() => {
      const currencyCode =
        currency === '$'
          ? 'USD'
          : currency === '\u20AC'
            ? 'EUR'
            : currency === '\u00A3'
              ? 'GBP'
              : 'USD';
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(price);
      } catch {
        return `${currency}${price.toFixed(2)}`;
      }
    }, [price, currency]);

    const lineTotal = useMemo(() => {
      const currencyCode =
        currency === '$'
          ? 'USD'
          : currency === '\u20AC'
            ? 'EUR'
            : currency === '\u00A3'
              ? 'GBP'
              : 'USD';
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(price * quantity);
      } catch {
        return `${currency}${(price * quantity).toFixed(2)}`;
      }
    }, [price, quantity, currency]);

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        role="group"
        aria-label={title}
        {...props}
      >
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} loading="lazy" />
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            {variant && <p className={styles.variant}>{variant}</p>}
            <p className={styles.price}>{formattedPrice}</p>
          </div>

          <div className={styles.actions}>
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={maxQuantity}
              size="sm"
            />
            <span className={styles.lineTotal} aria-label="Line total">
              {lineTotal}
            </span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={onRemove}
              aria-label={`Remove ${title} from cart`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  },
);
CartItem.displayName = 'CartItem';

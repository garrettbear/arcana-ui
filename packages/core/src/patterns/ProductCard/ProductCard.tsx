import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './ProductCard.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProductPrice {
  /** Current price */
  current: number;
  /** Original price before discount */
  original?: number;
  /** Currency code */
  currency?: string;
}

export interface ProductRating {
  /** Rating value (0-5) */
  value: number;
  /** Number of reviews */
  count?: number;
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product image URL */
  image: string;
  /** Product title */
  title: string;
  /** Price as number or object with current/original */
  price: number | ProductPrice;
  /** Star rating with optional review count */
  rating?: ProductRating;
  /** Badge text ("New", "Sale", "-20%", "Sold Out") */
  badge?: string;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'horizontal';
  /** Add to cart handler — shows button when provided */
  onAddToCart?: () => void;
  /** Favorite handler — shows heart when provided */
  onFavorite?: () => void;
  /** Link URL — makes card clickable */
  href?: string;
  /** Show skeleton loading state */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="half-star">
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      {half ? (
        <>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
            clipPath="url(#half-star)"
            className={styles.starFilled}
          />
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={styles.starEmpty}
          />
        </>
      ) : filled ? (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="currentColor"
          className={styles.starFilled}
        />
      ) : (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={styles.starEmpty}
        />
      )}
    </svg>
  );
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      title,
      price,
      rating,
      badge,
      variant = 'default',
      onAddToCart,
      onFavorite,
      href,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [favorited, setFavorited] = useState(false);
    const priceObj: ProductPrice = typeof price === 'number' ? { current: price } : price;
    const currency = priceObj.currency ?? 'USD';
    const isSale = priceObj.original != null && priceObj.original > priceObj.current;

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFavorited(!favorited);
      onFavorite?.();
    };

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(styles.card, styles[`variant-${variant}`], styles.loading, className)}
          aria-busy="true"
          {...props}
        >
          <div className={styles.imageSkeleton} />
          <div className={styles.body}>
            <div className={styles.skeletonLine} style={{ width: '70%' }} />
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
          </div>
        </div>
      );
    }

    const content = (
      <>
        <div className={styles.imageWrapper}>
          {/* biome-ignore lint/a11y/useAltText: alt is product title */}
          <img src={image} alt={title} className={styles.image} loading="lazy" />
          {badge && (
            <span
              className={cn(
                styles.badge,
                (badge.toLowerCase().includes('sale') || badge.startsWith('-')) && styles.badgeSale,
              )}
              aria-label={badge}
            >
              {badge}
            </span>
          )}
          {onFavorite && (
            <button
              type="button"
              className={cn(styles.favoriteBtn, favorited && styles.favorited)}
              onClick={handleFavorite}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          {rating && (
            <div className={styles.rating} role="img" aria-label={`${rating.value} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i < Math.floor(rating.value);
                const half = !filled && i < rating.value;
                return <StarIcon key={i} filled={filled} half={half} />;
              })}
              {rating.count != null && <span className={styles.ratingCount}>({rating.count})</span>}
            </div>
          )}
          <div className={styles.priceRow}>
            <span className={cn(styles.price, isSale && styles.priceSale)}>
              {formatPrice(priceObj.current, currency)}
            </span>
            {isSale && priceObj.original != null && (
              <span className={styles.originalPrice}>
                {formatPrice(priceObj.original, currency)}
              </span>
            )}
          </div>
          {onAddToCart && variant !== 'compact' && (
            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(styles.card, styles[`variant-${variant}`], styles.linked, className)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.card, styles[`variant-${variant}`], className)}
        {...props}
      >
        {content}
      </div>
    );
  },
);
ProductCard.displayName = 'ProductCard';

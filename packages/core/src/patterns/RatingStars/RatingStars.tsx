import React, { forwardRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './RatingStars.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RatingStarsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current rating value (0 to max, supports 0.5 increments) */
  value: number;
  /** Maximum number of stars */
  max?: number;
  /** Number of reviews to display after stars (e.g., 128 renders "(128)") */
  count?: number;
  /** Size of the star icons */
  size?: 'sm' | 'md' | 'lg';
  /** Enable interactive clicking and keyboard navigation */
  interactive?: boolean;
  /** Callback when rating changes (interactive mode only) */
  onChange?: (value: number) => void;
  /** Additional CSS class */
  className?: string;
}

// ─── Star SVG ───────────────────────────────────────────────────────────────

function StarIcon({
  fill,
  className,
}: { fill: 'full' | 'half' | 'empty'; className?: string }): React.JSX.Element {
  const clipId = React.useId();

  return (
    <svg
      className={cn(styles.star, className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {fill === 'half' && (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
      )}
      {/* Empty star (background) */}
      <path
        className={styles.starEmpty}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
      {/* Filled star (foreground) */}
      {fill !== 'empty' && (
        <path
          className={styles.starFilled}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="currentColor"
          clipPath={fill === 'half' ? `url(#${clipId})` : undefined}
        />
      )}
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export const RatingStars = forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    { value, max = 5, count, size = 'md', interactive = false, onChange, className, ...rest },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue ?? value;

    const getFill = useCallback(
      (index: number): 'full' | 'half' | 'empty' => {
        const starNumber = index + 1;
        if (displayValue >= starNumber) return 'full';
        if (displayValue >= starNumber - 0.5) return 'half';
        return 'empty';
      },
      [displayValue],
    );

    const handleClick = useCallback(
      (starIndex: number) => {
        if (!interactive || !onChange) return;
        onChange(starIndex + 1);
      },
      [interactive, onChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!interactive || !onChange) return;

        let newValue = value;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          newValue = Math.min(value + 1, max);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          newValue = Math.max(value - 1, 0);
        } else if (e.key === 'Home') {
          e.preventDefault();
          newValue = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newValue = max;
        }

        if (newValue !== value) {
          onChange(newValue);
        }
      },
      [interactive, onChange, value, max],
    );

    const ariaLabel = `${value} out of ${max} stars`;

    const stars = Array.from({ length: max }, (_, i) => {
      if (interactive) {
        return (
          <button
            key={i}
            type="button"
            className={styles.starButton}
            onClick={() => handleClick(i)}
            onMouseEnter={() => setHoverValue(i + 1)}
            onMouseLeave={() => setHoverValue(null)}
            onFocus={() => setHoverValue(i + 1)}
            onBlur={() => setHoverValue(null)}
            aria-label={`Rate ${i + 1} out of ${max}`}
            tabIndex={-1}
          >
            <StarIcon fill={getFill(i)} />
          </button>
        );
      }
      return <StarIcon key={i} fill={getFill(i)} />;
    });

    if (interactive) {
      return (
        <div
          ref={ref}
          role="radiogroup"
          aria-label={ariaLabel}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn(styles.rating, styles[`size-${size}`], styles.interactive, className)}
          {...rest}
        >
          <span className={styles.stars}>{stars}</span>
          {count != null && <span className={styles.count}>({count})</span>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        className={cn(styles.rating, styles[`size-${size}`], className)}
        {...rest}
      >
        <span className={styles.stars}>{stars}</span>
        {count != null && <span className={styles.count}>({count})</span>}
      </div>
    );
  },
);

RatingStars.displayName = 'RatingStars';

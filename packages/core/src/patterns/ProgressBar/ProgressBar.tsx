import React from 'react';
import { cn } from '../../utils/cn';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0-100 by default, or 0-max) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Visual variant */
  variant?: 'default' | 'striped' | 'animated';
  /** Bar height size */
  size?: 'sm' | 'md' | 'lg';
  /** Color mapped to semantic status colors */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Accessible label for the progress bar */
  label?: string;
  /** Display percentage text alongside the bar */
  showValue?: boolean;
  /** Indeterminate mode — shows infinite loading animation */
  indeterminate?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      color = 'primary',
      label,
      showValue = false,
      indeterminate = false,
      className,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const displayValue = `${Math.round(percentage)}%`;

    return (
      <div
        ref={ref}
        className={cn(
          styles.progressBar,
          styles[`size-${size}`],
          showValue && styles.withValue,
          className,
        )}
        {...props}
      >
        {/* biome-ignore lint/a11y/useFocusableInteractive: progressbar is informational, not interactive */}
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={cn(
              styles.fill,
              styles[`color-${color}`],
              variant === 'striped' && styles.striped,
              variant === 'animated' && styles.animated,
              indeterminate && styles.indeterminate,
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
        {showValue && !indeterminate && (
          <span className={styles.valueText} aria-hidden="true">
            {displayValue}
          </span>
        )}
      </div>
    );
  },
);
ProgressBar.displayName = 'ProgressBar';

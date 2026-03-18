import React from 'react';
import { cn } from '../../utils/cn';
import styles from './StatCard.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Trend indicator for StatCard */
export interface StatTrend {
  /** Percentage change value */
  value: number;
  /** Direction of the trend */
  direction: 'up' | 'down' | 'neutral';
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDListElement> {
  /** The main metric value */
  value: string | number;
  /** Label describing the metric */
  label: string;
  /** Prefix displayed before the value (e.g., "$", "€") */
  prefix?: string;
  /** Suffix displayed after the value (e.g., "%", "+", "users") */
  suffix?: string;
  /** Trend indicator with direction and percentage */
  trend?: StatTrend;
  /** Comparison text (e.g., "vs last month") */
  comparison?: string;
  /** Icon displayed in the card */
  icon?: React.ReactNode;
  /** Visual variant — "compact" uses smaller spacing and no icon */
  variant?: 'default' | 'compact';
  /** Show skeleton loading state */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Trend Arrow ────────────────────────────────────────────────────────────

function TrendArrow({
  direction,
}: { direction: 'up' | 'down' | 'neutral' }): React.JSX.Element | null {
  if (direction === 'up') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─── StatCard ───────────────────────────────────────────────────────────────

export const StatCard = React.forwardRef<HTMLDListElement, StatCardProps>(
  (
    {
      value,
      label,
      prefix,
      suffix,
      trend,
      comparison,
      icon,
      variant = 'default',
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const trendLabel = trend ? `${trend.direction} ${Math.abs(trend.value)}%` : undefined;

    return (
      <dl
        ref={ref}
        className={cn(
          styles.statCard,
          styles[`variant-${variant}`],
          loading && styles.loading,
          className,
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <dt className={styles.label}>
              <span className={styles.skeleton} style={{ width: '60%' }} />
            </dt>
            <dd className={styles.valueWrapper}>
              <span className={cn(styles.skeleton, styles.skeletonValue)} />
            </dd>
          </>
        ) : (
          <>
            {icon && variant === 'default' && (
              <div className={styles.iconWrapper} aria-hidden="true">
                {icon}
              </div>
            )}
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.valueWrapper}>
              <span className={styles.value}>
                {prefix && <span className={styles.affix}>{prefix}</span>}
                {value}
                {suffix && <span className={styles.affix}>{suffix}</span>}
              </span>
              {trend && (
                <span
                  className={cn(styles.trend, styles[`trend-${trend.direction}`])}
                  aria-label={trendLabel}
                >
                  <TrendArrow direction={trend.direction} />
                  {Math.abs(trend.value)}%
                </span>
              )}
            </dd>
            {comparison && <dd className={styles.comparison}>{comparison}</dd>}
          </>
        )}
      </dl>
    );
  },
);
StatCard.displayName = 'StatCard';

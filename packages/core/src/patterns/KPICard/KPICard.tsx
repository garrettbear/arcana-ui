import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import styles from './KPICard.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Trend data for KPICard */
export interface KPITrend {
  /** Percentage change value */
  value: number;
  /** Direction of the trend */
  direction: 'up' | 'down' | 'neutral';
}

/** Target line configuration for the sparkline */
export interface KPITarget {
  /** Target value */
  value: number;
  /** Target label (e.g., "Target", "Goal") */
  label: string;
}

export interface KPICardProps extends React.HTMLAttributes<HTMLDListElement> {
  /** The main metric value */
  value: string | number;
  /** Label describing the metric */
  label: string;
  /** Prefix displayed before the value (e.g., "$", "€") */
  prefix?: string;
  /** Suffix displayed after the value (e.g., "%", "ms") */
  suffix?: string;
  /** Trend indicator with direction and percentage */
  trend?: KPITrend;
  /** Array of recent values for the sparkline chart */
  data?: number[];
  /** Custom sparkline color (defaults to trend color) */
  sparklineColor?: string;
  /** Target line on the sparkline */
  target?: KPITarget;
  /** Time period label (e.g., "Last 7 days") */
  period?: string;
  /** Visual variant — "compact" uses smaller spacing */
  variant?: 'default' | 'compact';
  /** Show skeleton loading state */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Sparkline SVG ──────────────────────────────────────────────────────────

interface SparklineProps {
  data: number[];
  color: string;
  target?: KPITarget;
}

function Sparkline({ data, color, target }: SparklineProps): React.JSX.Element {
  const { points, targetY, viewBox } = useMemo(() => {
    if (data.length < 2) {
      return { points: '', targetY: 0, viewBox: '0 0 100 40' };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const width = 100;
    const height = 40;

    const pts = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

    const tY = target
      ? height - padding - ((target.value - min) / range) * (height - padding * 2)
      : 0;

    return { points: pts, targetY: tY, viewBox: `0 0 ${width} ${height}` };
  }, [data, target]);

  if (data.length < 2) return <></>;

  return (
    <svg
      className={styles.sparkline}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {target && (
        <line
          x1="0"
          y1={targetY}
          x2="100"
          y2={targetY}
          stroke="var(--kpicard-target-line-color, var(--color-fg-muted))"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Trend Arrow ────────────────────────────────────────────────────────────

function TrendArrow({ direction }: { direction: 'up' | 'down' | 'neutral' }): React.JSX.Element {
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

// ─── KPICard ────────────────────────────────────────────────────────────────

export const KPICard = React.forwardRef<HTMLDListElement, KPICardProps>(
  (
    {
      value,
      label,
      prefix,
      suffix,
      trend,
      data,
      sparklineColor,
      target,
      period,
      variant = 'default',
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedColor = useMemo(() => {
      if (sparklineColor) return sparklineColor;
      if (!trend) return 'var(--color-fg-muted)';
      if (trend.direction === 'up')
        return 'var(--statcard-trend-up, var(--color-status-success-fg))';
      if (trend.direction === 'down')
        return 'var(--statcard-trend-down, var(--color-status-error-fg))';
      return 'var(--color-fg-muted)';
    }, [sparklineColor, trend]);

    const trendLabel = trend ? `${trend.direction} ${Math.abs(trend.value)}%` : undefined;

    return (
      <dl
        ref={ref}
        className={cn(
          styles.kpiCard,
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
            <dd className={styles.sparklineWrapper}>
              <span className={cn(styles.skeleton, styles.skeletonSparkline)} />
            </dd>
          </>
        ) : (
          <>
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
            {data && data.length >= 2 && (
              <dd className={styles.sparklineWrapper}>
                <Sparkline data={data} color={resolvedColor} target={target} />
              </dd>
            )}
            {(period || target) && (
              <dd className={styles.meta}>
                {period && <span className={styles.period}>{period}</span>}
                {target && <span className={styles.targetLabel}>Target: {target.label}</span>}
              </dd>
            )}
          </>
        )}
      </dl>
    );
  },
);
KPICard.displayName = 'KPICard';

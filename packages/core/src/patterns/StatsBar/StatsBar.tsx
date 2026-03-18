import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './StatsBar.module.css';

// ─── StatsBar ────────────────────────────────────────────────────────────────

export interface StatsBarProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Layout variant */
  variant?: 'inline' | 'card';
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Whether to animate numbers counting up on scroll into view */
  animated?: boolean;
}

export const StatsBar = React.forwardRef<HTMLDListElement, StatsBarProps>(
  ({ variant = 'inline', columns = 4, animated = false, children, className, ...props }, ref) => {
    const innerRef = useRef<HTMLDListElement | null>(null);
    const [visible, setVisible] = useState(false);

    const setRefs = useCallback(
      (el: HTMLDListElement | null) => {
        innerRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDListElement | null>).current = el;
      },
      [ref],
    );

    useEffect(() => {
      if (!animated || !innerRef.current) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(innerRef.current);
      return () => observer.disconnect();
    }, [animated]);

    return (
      <dl
        ref={setRefs}
        className={cn(styles.bar, styles[variant], styles[`cols${columns}`], className)}
        data-visible={animated ? visible : true}
        {...props}
      >
        {children}
      </dl>
    );
  },
);
StatsBar.displayName = 'StatsBar';

// ─── StatItem ────────────────────────────────────────────────────────────────

export interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The stat value (e.g., "10K+", "99.9%") */
  value: string;
  /** Label describing the stat */
  label: string;
  /** Prefix before value (e.g., "$") */
  prefix?: string;
  /** Suffix after value (e.g., "%", "+") */
  suffix?: string;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
}

export const StatItem = React.forwardRef<HTMLDivElement, StatItemProps>(
  ({ value, label, prefix, suffix, trend, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.item, className)} {...props}>
        <dd className={styles.value}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <span>{value}</span>
          {suffix && <span className={styles.suffix}>{suffix}</span>}
          {trend && trend !== 'neutral' && (
            <span
              className={cn(styles.trend, trend === 'up' ? styles.trendUp : styles.trendDown)}
              aria-label={`trending ${trend}`}
            >
              {trend === 'up' ? '\u2191' : '\u2193'}
            </span>
          )}
        </dd>
        <dt className={styles.label}>{label}</dt>
      </div>
    );
  },
);
StatItem.displayName = 'StatItem';

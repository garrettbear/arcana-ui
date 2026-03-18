import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Timeline.module.css';

// ─── Timeline ────────────────────────────────────────────────────────────────

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of the line relative to content */
  position?: 'left' | 'alternate';
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ position = 'left', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.timeline, position === 'alternate' && styles.alternate, className)}
        role="list"
        {...props}
      >
        {children}
      </div>
    );
  },
);
Timeline.displayName = 'Timeline';

// ─── TimelineItem ────────────────────────────────────────────────────────────

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or indicator for the timeline dot */
  icon?: React.ReactNode;
  /** Date or time label */
  date?: string;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ icon, date, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.item, className)} role="listitem" {...props}>
        <div className={styles.indicator}>
          <div className={styles.dot}>{icon}</div>
          <div className={styles.line} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          {date && <time className={styles.date}>{date}</time>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    );
  },
);
TimelineItem.displayName = 'TimelineItem';

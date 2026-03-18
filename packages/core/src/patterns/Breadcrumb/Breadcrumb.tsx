import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Breadcrumb.module.css';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom separator element between items */
  separator?: React.ReactNode;
  /** Maximum items to display before truncating with ellipsis */
  maxItems?: number;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator, maxItems, children, className, ...props }, ref) => {
    let items = React.Children.toArray(children);

    // Truncate middle items if maxItems is set
    if (maxItems && items.length > maxItems && maxItems >= 2) {
      const firstItems = items.slice(0, 1);
      const lastItems = items.slice(-(maxItems - 1));
      items = [
        ...firstItems,
        <span key="breadcrumb-ellipsis" className={styles.truncated}>
          ...
        </span>,
        ...lastItems,
      ];
    }
    const defaultSeparator = (
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
        <polyline points="9 18 15 12 9 6" />
      </svg>
    );
    const sep = separator ?? defaultSeparator;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(styles.breadcrumb, className)}
        {...props}
      >
        <ol className={styles.list}>
          {items.map((child, i) => (
            <li key={i} className={styles.listItem}>
              {child}
              {i < items.length - 1 && (
                <span className={styles.separator} aria-hidden="true">
                  {sep}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** URL for the breadcrumb link */
  href?: string;
  /** Whether this is the current (last) page */
  current?: boolean;
}

export const BreadcrumbItem = React.forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ href, current = false, children, className, ...props }, ref) => {
    if (href && !current) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(styles.link, className)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(styles.item, current && styles.current, className)}
        aria-current={current ? 'page' : undefined}
        {...props}
      >
        {children}
      </span>
    );
  },
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

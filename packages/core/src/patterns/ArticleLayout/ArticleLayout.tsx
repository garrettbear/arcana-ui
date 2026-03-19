import React from 'react';
import { cn } from '../../utils/cn';
import styles from './ArticleLayout.module.css';

export interface ArticleLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** Article body content */
  children: React.ReactNode;
  /** Maximum content width */
  maxWidth?: 'prose' | 'wide' | 'full';
  /** Sidebar content (TOC, author info, related) */
  sidebar?: React.ReactNode;
  /** Sidebar position */
  sidebarPosition?: 'left' | 'right';
  /** Whether sidebar sticks while scrolling */
  sidebarSticky?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const ArticleLayout = React.forwardRef<HTMLElement, ArticleLayoutProps>(
  (
    {
      children,
      maxWidth = 'prose',
      sidebar,
      sidebarPosition = 'right',
      sidebarSticky = true,
      className,
      ...props
    },
    ref,
  ) => {
    const hasSidebar = sidebar != null;

    return (
      <article
        ref={ref}
        className={cn(
          styles.article,
          styles[`width-${maxWidth}`],
          hasSidebar && styles.withSidebar,
          hasSidebar && styles[`sidebar-${sidebarPosition}`],
          className,
        )}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        {hasSidebar && (
          <aside className={cn(styles.sidebar, sidebarSticky && styles.sidebarSticky)}>
            {sidebar}
          </aside>
        )}
      </article>
    );
  },
);
ArticleLayout.displayName = 'ArticleLayout';

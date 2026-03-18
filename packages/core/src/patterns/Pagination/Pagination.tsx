import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Pagination.module.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current active page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when the page changes */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show on each side of the current page */
  siblingCount?: number;
  /** Whether to show first/last page buttons */
  showEdges?: boolean;
}

function getPageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const totalNumbers = siblingCount * 2 + 3; // siblings + current + 2 edge pages
  const totalButtons = totalNumbers + 2; // + 2 ellipsis slots

  if (totalPages <= totalButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = totalNumbers;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = totalNumbers;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + i + 1,
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { page, totalPages, onPageChange, siblingCount = 1, showEdges = true, className, ...props },
    ref,
  ) => {
    const pages = getPageRange(page, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn(styles.pagination, className)}
        {...props}
      >
        {showEdges && (
          <button
            type="button"
            className={cn(styles.button, styles.edge)}
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            aria-label="Go to first page"
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
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className={cn(styles.button, styles.nav)}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Go to previous page"
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.pages}>
          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={cn(styles.button, styles.page, p === page && styles.active)}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className={cn(styles.button, styles.nav)}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Go to next page"
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
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {showEdges && (
          <button
            type="button"
            className={cn(styles.button, styles.edge)}
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            aria-label="Go to last page"
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
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        )}
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';

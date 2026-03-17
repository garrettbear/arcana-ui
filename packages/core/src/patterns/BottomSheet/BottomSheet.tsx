import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './BottomSheet.module.css';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  open: boolean;
  /** Callback fired when the sheet should close */
  onClose: () => void;
  /** Optional header title */
  title?: string;
  /** Optional header description */
  description?: string;
  /** Snap points as fractions of viewport height */
  snapPoints?: number[];
  /** Whether the sheet can be dismissed by tapping the overlay */
  dismissible?: boolean;
  /** Whether to show the drag handle bar */
  showHandle?: boolean;
  /** Sheet body content */
  children?: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      snapPoints = [0.5, 0.9],
      dismissible = true,
      showHandle = true,
      children,
      className,
    },
    ref,
  ) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const titleId = useRef(`bottomsheet-title-${Math.random().toString(36).slice(2)}`);
    const descId = useRef(`bottomsheet-desc-${Math.random().toString(36).slice(2)}`);

    const trapFocus = useCallback((e: KeyboardEvent) => {
      if (!sheetRef.current) return;
      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dismissible) {
          onClose();
        }
        trapFocus(e);
      },
      [dismissible, onClose, trapFocus],
    );

    useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        const raf = requestAnimationFrame(() => {
          if (sheetRef.current) {
            const focusable = sheetRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
            focusable?.focus();
          }
        });
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          cancelAnimationFrame(raf);
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
          previousFocusRef.current?.focus();
        };
      }
    }, [open, handleKeyDown]);

    if (!open) return null;

    const initialHeight = snapPoints[0] ?? 0.5;
    const maxHeight = `${initialHeight * 100}vh`;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (dismissible && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div ref={ref} className={styles.overlay} onClick={handleOverlayClick} aria-hidden="false">
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId.current : undefined}
          aria-describedby={description ? descId.current : undefined}
          className={cn(styles.sheet, className)}
          style={{ maxHeight }}
        >
          {showHandle && (
            <div className={styles.handle}>
              <div className={styles.handleBar} />
            </div>
          )}

          {(title || description) && (
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {title && (
                  <h2 id={titleId.current} className={styles.title}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId.current} className={styles.description}>
                    {description}
                  </p>
                )}
              </div>
              {dismissible && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className={styles.body}>{children}</div>
        </div>
      </div>
    );
  },
);
BottomSheet.displayName = 'BottomSheet';

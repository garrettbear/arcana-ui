import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './DrawerNav.module.css';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface DrawerNavProps {
  /** Whether the drawer is visible */
  open: boolean;
  /** Callback fired when the drawer should close */
  onClose: () => void;
  /** Which side the drawer slides in from */
  side?: 'left' | 'right';
  /** Drawer width (CSS value) */
  width?: string;
  /** Optional title shown at top of drawer */
  title?: string;
  /** Drawer body content */
  children?: React.ReactNode;
  /** Whether to show the backdrop overlay */
  overlay?: boolean;
  /** Additional CSS class name */
  className?: string;
}

export const DrawerNav = React.forwardRef<HTMLDivElement, DrawerNavProps>(
  (
    {
      open,
      onClose,
      side = 'left',
      width,
      title,
      children,
      overlay: showOverlay = true,
      className,
    },
    ref,
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const trapFocus = useCallback((e: KeyboardEvent) => {
      if (!drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
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
        if (e.key === 'Escape') {
          onClose();
        }
        trapFocus(e);
      },
      [onClose, trapFocus],
    );

    useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        const raf = requestAnimationFrame(() => {
          if (drawerRef.current) {
            const focusable = drawerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
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

    const drawerStyle = width ? { width, maxWidth: width } : undefined;

    return (
      <>
        {showOverlay && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
        <div
          ref={(node) => {
            (drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Navigation drawer'}
          className={cn(styles.drawer, styles[side], className)}
          style={drawerStyle}
        >
          <div className={styles.header}>
            {title ? <h2 className={styles.title}>{title}</h2> : <span />}
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close drawer"
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
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </>
    );
  },
);
DrawerNav.displayName = 'DrawerNav';

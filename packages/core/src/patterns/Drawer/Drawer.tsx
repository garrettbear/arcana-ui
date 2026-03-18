import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Drawer.module.css';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DrawerProps {
  /** Whether the drawer is visible */
  open: boolean;
  /** Callback fired when the drawer should close */
  onClose: () => void;
  /** Which side the drawer slides in from */
  side?: 'left' | 'right' | 'top' | 'bottom';
  /** Size preset — sm: 320px, md: 420px, lg: 640px, full: 100% */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Optional title in the header */
  title?: string;
  /** Optional description below title */
  description?: string;
  /** Whether to show the backdrop overlay */
  overlay?: boolean;
  /** Close when clicking the overlay backdrop */
  closeOnOverlayClick?: boolean;
  /** Close when pressing Escape */
  closeOnEsc?: boolean;
  /** Show close button in header */
  showClose?: boolean;
  /** Drawer body content */
  children?: React.ReactNode;
  /** Optional sticky footer content */
  footer?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// ─── Drawer ─────────────────────────────────────────────────────────────────

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side = 'right',
      size = 'md',
      title,
      description,
      overlay: showOverlay = true,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showClose = true,
      children,
      footer,
      className,
    },
    ref,
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const titleId = React.useId();
    const descId = React.useId();

    // ─── Focus trap ───────────────────────────────────────────────
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
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }, []);

    // ─── Escape key ───────────────────────────────────────────────
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEsc) {
          e.preventDefault();
          onClose();
        }
        trapFocus(e);
      },
      [closeOnEsc, onClose, trapFocus],
    );

    // ─── Open/close effects ───────────────────────────────────────
    useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        // Focus first focusable element
        requestAnimationFrame(() => {
          const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
          focusable?.[0]?.focus();
        });
      } else {
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open, handleKeyDown]);

    if (!open) return null;

    const isHorizontal = side === 'left' || side === 'right';

    return (
      <div className={styles.wrapper}>
        {showOverlay && (
          <div
            className={styles.overlay}
            aria-hidden="true"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
        )}
        <div
          ref={(node) => {
            (drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          className={cn(
            styles.drawer,
            styles[`side-${side}`],
            isHorizontal ? styles[`width-${size}`] : styles[`height-${size}`],
            className,
          )}
        >
          {(title || showClose) && (
            <div className={styles.header}>
              <div className={styles.headerText}>
                {title && (
                  <h2 id={titleId} className={styles.title}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className={styles.description}>
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <svg
                    width="20"
                    height="20"
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
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    );
  },
);
Drawer.displayName = 'Drawer';

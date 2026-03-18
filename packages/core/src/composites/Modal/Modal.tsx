import React, { useCallback, useEffect, useId, useRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Modal.module.css';

// Focusable elements selector
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

// ModalClose

export interface ModalCloseProps {
  /** Callback fired when the close button is clicked */
  onClick: () => void;
  /** Additional CSS class name */
  className?: string;
}

export const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ onClick, className }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(styles.closeButton, className)}
      onClick={onClick}
      aria-label="Close dialog"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
  ),
);
ModalClose.displayName = 'ModalClose';

// Modal

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Callback fired when the modal should close */
  onClose: () => void;
  /** Dialog title text */
  title?: string;
  /** Dialog description text */
  description?: string;
  /** Size of the modal dialog */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Modal body content */
  children?: React.ReactNode;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEsc?: boolean;
  /** Footer content rendered at the bottom of the modal */
  footer?: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      size = 'md',
      children,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      footer,
      className,
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const descId = `${baseId}-desc`;

    // Focus trap
    const trapFocus = useCallback((e: KeyboardEvent) => {
      if (!dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
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
        if (e.key === 'Escape' && closeOnEsc) {
          onClose();
        }
        trapFocus(e);
      },
      [closeOnEsc, onClose, trapFocus],
    );

    useEffect(() => {
      if (open) {
        // Save currently focused element
        previousFocusRef.current = document.activeElement as HTMLElement;
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        // Focus first focusable element after render
        const raf = requestAnimationFrame(() => {
          if (dialogRef.current) {
            const focusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
            focusable?.focus();
          }
        });
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          cancelAnimationFrame(raf);
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
          // Restore focus
          previousFocusRef.current?.focus();
        };
      }
    }, [open, handleKeyDown]);

    if (!open) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    const modal = (
      <div ref={ref} className={styles.overlay} onClick={handleOverlayClick} aria-hidden="false">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          className={cn(styles.dialog, styles[size], className)}
        >
          {/* Header */}
          {(title || description) && (
            <div className={styles.dialogHeader}>
              <div className={styles.dialogHeaderContent}>
                {title && (
                  <h2 id={titleId} className={styles.dialogTitle}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className={styles.dialogDescription}>
                    {description}
                  </p>
                )}
              </div>
              <ModalClose onClick={onClose} />
            </div>
          )}

          {/* If no title/description, still show close button */}
          {!title && !description && (
            <div className={styles.closeOnly}>
              <ModalClose onClick={onClose} />
            </div>
          )}

          {/* Body */}
          {children && <div className={styles.dialogBody}>{children}</div>}

          {/* Footer */}
          {footer && <div className={styles.dialogFooter}>{footer}</div>}
        </div>
      </div>
    );

    return modal;
  },
);
Modal.displayName = 'Modal';

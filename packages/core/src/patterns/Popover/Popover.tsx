import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFloating } from '../../hooks/useFloating';
import { cn } from '../../utils/cn';
import styles from './Popover.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PopoverProps {
  /** The trigger element that opens the popover */
  trigger: React.ReactNode;
  /** Popover content */
  content: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Preferred side relative to trigger */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along the side axis */
  align?: 'start' | 'center' | 'end';
  /** Pixel gap between trigger and popover */
  sideOffset?: number;
  /** What interaction opens the popover */
  triggerOn?: 'click' | 'hover';
  /** Close when clicking outside */
  closeOnOutsideClick?: boolean;
  /** Close when pressing Escape */
  closeOnEsc?: boolean;
  /** Show arrow pointing to trigger */
  showArrow?: boolean;
  /** Additional CSS class for the popover panel */
  className?: string;
}

// ─── Popover ────────────────────────────────────────────────────────────────

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      content,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      triggerOn = 'click',
      closeOnOutsideClick = true,
      closeOnEsc = true,
      showArrow = false,
      className,
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const hoverTimeoutRef = useRef<number>(0);

    const { triggerRef, floatingRef, position, floatingStyles } = useFloating<
      HTMLDivElement,
      HTMLDivElement
    >({
      open: isOpen,
      placement: side,
      alignment: align,
      offset: sideOffset,
    });

    const setOpen = useCallback(
      (value: boolean) => {
        if (controlledOpen === undefined) setInternalOpen(value);
        onOpenChange?.(value);
      },
      [controlledOpen, onOpenChange],
    );

    // ─── Click outside ────────────────────────────────────────────
    useEffect(() => {
      if (!isOpen || !closeOnOutsideClick) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!triggerRef.current?.contains(target) && !floatingRef.current?.contains(target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, closeOnOutsideClick, setOpen, triggerRef, floatingRef]);

    // ─── Escape key ───────────────────────────────────────────────
    useEffect(() => {
      if (!isOpen || !closeOnEsc) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpen(false);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [isOpen, closeOnEsc, setOpen]);

    // ─── Trigger handlers ─────────────────────────────────────────
    const handleClick = useCallback(() => {
      if (triggerOn === 'click') setOpen(!isOpen);
    }, [triggerOn, isOpen, setOpen]);

    const handleMouseEnter = useCallback(() => {
      if (triggerOn !== 'hover') return;
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = window.setTimeout(() => setOpen(true), 200);
    }, [triggerOn, setOpen]);

    const handleMouseLeave = useCallback(() => {
      if (triggerOn !== 'hover') return;
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = window.setTimeout(() => setOpen(false), 300);
    }, [triggerOn, setOpen]);

    const handleFocus = useCallback(() => {
      if (triggerOn === 'hover') setOpen(true);
    }, [triggerOn, setOpen]);

    const handleBlur = useCallback(() => {
      if (triggerOn === 'hover') {
        // Delay to allow focus to move within popover
        setTimeout(() => {
          if (
            !triggerRef.current?.contains(document.activeElement) &&
            !floatingRef.current?.contains(document.activeElement)
          ) {
            setOpen(false);
          }
        }, 100);
      }
    }, [triggerOn, setOpen, triggerRef, floatingRef]);

    return (
      <div ref={ref} className={styles.popoverWrapper} style={{ display: 'inline-block' }}>
        <div
          ref={triggerRef}
          className={styles.triggerWrapper}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {React.isValidElement(trigger)
            ? React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
                'aria-expanded': isOpen,
                'aria-haspopup': 'dialog',
              })
            : trigger}
        </div>
        {isOpen && (
          <div
            ref={floatingRef}
            className={cn(styles.popover, styles[`side-${position.placement}`], className)}
            style={floatingStyles}
            onMouseEnter={triggerOn === 'hover' ? handleMouseEnter : undefined}
            onMouseLeave={triggerOn === 'hover' ? handleMouseLeave : undefined}
          >
            {showArrow && (
              <div className={cn(styles.arrow, styles[`arrow-${position.placement}`])} />
            )}
            {content}
          </div>
        )}
      </div>
    );
  },
);
Popover.displayName = 'Popover';

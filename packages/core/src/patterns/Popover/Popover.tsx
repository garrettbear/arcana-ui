import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// ─── Position Calculator ────────────────────────────────────────────────────

interface Position {
  top: number;
  left: number;
  actualSide: 'top' | 'right' | 'bottom' | 'left';
}

function calcPosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  side: 'top' | 'right' | 'bottom' | 'left',
  align: 'start' | 'center' | 'end',
  offset: number,
): Position {
  let top = 0;
  let left = 0;
  let actualSide = side;

  // Primary positioning
  if (side === 'bottom') {
    top = triggerRect.bottom + offset;
    if (top + popoverRect.height > window.innerHeight) {
      top = triggerRect.top - popoverRect.height - offset;
      actualSide = 'top';
    }
  } else if (side === 'top') {
    top = triggerRect.top - popoverRect.height - offset;
    if (top < 0) {
      top = triggerRect.bottom + offset;
      actualSide = 'bottom';
    }
  } else if (side === 'right') {
    left = triggerRect.right + offset;
    if (left + popoverRect.width > window.innerWidth) {
      left = triggerRect.left - popoverRect.width - offset;
      actualSide = 'left';
    }
  } else {
    left = triggerRect.left - popoverRect.width - offset;
    if (left < 0) {
      left = triggerRect.right + offset;
      actualSide = 'right';
    }
  }

  // Cross-axis alignment
  if (actualSide === 'top' || actualSide === 'bottom') {
    if (align === 'start') left = triggerRect.left;
    else if (align === 'end') left = triggerRect.right - popoverRect.width;
    else left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - popoverRect.width - 8));
  } else {
    if (align === 'start') top = triggerRect.top;
    else if (align === 'end') top = triggerRect.bottom - popoverRect.height;
    else top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - popoverRect.height - 8));
  }

  return { top, left, actualSide };
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

    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<number>(0);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0, actualSide: side });

    const setOpen = useCallback(
      (value: boolean) => {
        if (controlledOpen === undefined) setInternalOpen(value);
        onOpenChange?.(value);
      },
      [controlledOpen, onOpenChange],
    );

    // ─── Position calculation ─────────────────────────────────────
    useLayoutEffect(() => {
      if (!isOpen || !triggerRef.current || !popoverRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      setPosition(calcPosition(triggerRect, popoverRect, side, align, sideOffset));
    }, [isOpen, side, align, sideOffset]);

    // Reposition on scroll/resize
    useEffect(() => {
      if (!isOpen) return;
      const update = () => {
        if (!triggerRef.current || !popoverRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        setPosition(calcPosition(triggerRect, popoverRect, side, align, sideOffset));
      };
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    }, [isOpen, side, align, sideOffset]);

    // ─── Click outside ────────────────────────────────────────────
    useEffect(() => {
      if (!isOpen || !closeOnOutsideClick) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, closeOnOutsideClick, setOpen]);

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
            !popoverRef.current?.contains(document.activeElement)
          ) {
            setOpen(false);
          }
        }, 100);
      }
    }, [triggerOn, setOpen]);

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
            ref={popoverRef}
            className={cn(styles.popover, styles[`side-${position.actualSide}`], className)}
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onMouseEnter={triggerOn === 'hover' ? handleMouseEnter : undefined}
            onMouseLeave={triggerOn === 'hover' ? handleMouseLeave : undefined}
          >
            {showArrow && (
              <div className={cn(styles.arrow, styles[`arrow-${position.actualSide}`])} />
            )}
            {content}
          </div>
        )}
      </div>
    );
  },
);
Popover.displayName = 'Popover';

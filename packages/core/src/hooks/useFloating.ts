import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Which side of the trigger the floating element should appear on */
export type Placement = 'top' | 'right' | 'bottom' | 'left';

/** Alignment along the cross axis */
export type Alignment = 'start' | 'center' | 'end';

/** Computed position for the floating element */
export interface FloatingPosition {
  /** CSS top value in pixels */
  top: number;
  /** CSS left value in pixels */
  left: number;
  /** The side actually used (may differ from preferred if flipped) */
  placement: Placement;
}

/** Options for the useFloating hook */
export interface UseFloatingOptions {
  /** Whether the floating element is currently visible */
  open: boolean;
  /** Preferred placement relative to the trigger */
  placement?: Placement;
  /** Alignment along the cross axis */
  alignment?: Alignment;
  /** Pixel gap between trigger and floating element */
  offset?: number;
  /** Viewport padding in pixels to prevent edge clipping */
  padding?: number;
  /** If true, locks to the preferred placement and skips flip logic */
  fixed?: boolean;
}

/** Return value of the useFloating hook */
export interface UseFloatingReturn<
  T extends HTMLElement = HTMLElement,
  F extends HTMLElement = HTMLElement,
> {
  /** Ref to attach to the trigger element */
  triggerRef: React.RefObject<T>;
  /** Ref to attach to the floating element */
  floatingRef: React.RefObject<F>;
  /** Computed position (apply as inline style) */
  position: FloatingPosition;
  /** Inline styles to apply to the floating element */
  floatingStyles: React.CSSProperties;
}

// ─── Position Calculator ────────────────────────────────────────────────────

function calcPosition(
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  placement: Placement,
  alignment: Alignment,
  offset: number,
  padding: number,
  fixed: boolean,
): FloatingPosition {
  let top = 0;
  let left = 0;
  let actualPlacement = placement;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // ── Main axis (which side) ──
  if (placement === 'bottom') {
    top = triggerRect.bottom + offset;
    if (!fixed && top + floatingRect.height > vh - padding) {
      top = triggerRect.top - floatingRect.height - offset;
      actualPlacement = 'top';
    }
  } else if (placement === 'top') {
    top = triggerRect.top - floatingRect.height - offset;
    if (!fixed && top < padding) {
      top = triggerRect.bottom + offset;
      actualPlacement = 'bottom';
    }
  } else if (placement === 'right') {
    left = triggerRect.right + offset;
    if (!fixed && left + floatingRect.width > vw - padding) {
      left = triggerRect.left - floatingRect.width - offset;
      actualPlacement = 'left';
    }
  } else {
    // left
    left = triggerRect.left - floatingRect.width - offset;
    if (!fixed && left < padding) {
      left = triggerRect.right + offset;
      actualPlacement = 'right';
    }
  }

  // ── Cross axis (alignment) ──
  if (actualPlacement === 'top' || actualPlacement === 'bottom') {
    if (alignment === 'start') left = triggerRect.left;
    else if (alignment === 'end') left = triggerRect.right - floatingRect.width;
    else left = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
    // Clamp within viewport
    left = Math.max(padding, Math.min(left, vw - floatingRect.width - padding));
  } else {
    if (alignment === 'start') top = triggerRect.top;
    else if (alignment === 'end') top = triggerRect.bottom - floatingRect.height;
    else top = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
    top = Math.max(padding, Math.min(top, vh - floatingRect.height - padding));
  }

  return { top, left, placement: actualPlacement };
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Positions a floating element relative to a trigger, with smart flip and
 * viewport clamping. Zero dependencies — a lightweight alternative to
 * Floating UI / Popper.js.
 *
 * @example
 * ```tsx
 * const { triggerRef, floatingRef, floatingStyles } = useFloating({
 *   open: isOpen,
 *   placement: 'bottom',
 *   alignment: 'center',
 *   offset: 8,
 * });
 *
 * return (
 *   <>
 *     <button ref={triggerRef}>Open</button>
 *     {isOpen && <div ref={floatingRef} style={floatingStyles}>Content</div>}
 *   </>
 * );
 * ```
 */
export function useFloating<
  T extends HTMLElement = HTMLElement,
  F extends HTMLElement = HTMLElement,
>({
  open,
  placement = 'bottom',
  alignment = 'center',
  offset = 8,
  padding = 8,
  fixed = false,
}: UseFloatingOptions): UseFloatingReturn<T, F> {
  const triggerRef = useRef<T>(null);
  const floatingRef = useRef<F>(null);
  const [position, setPosition] = useState<FloatingPosition>({
    top: 0,
    left: 0,
    placement,
  });

  const update = useCallback(() => {
    if (!triggerRef.current || !floatingRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const floatingRect = floatingRef.current.getBoundingClientRect();
    setPosition(
      calcPosition(triggerRect, floatingRect, placement, alignment, offset, padding, fixed),
    );
  }, [placement, alignment, offset, padding, fixed]);

  // Calculate on open and when options change
  useLayoutEffect(() => {
    if (open) update();
  }, [open, update]);

  // Recalculate on scroll (capture phase for nested scrollers) and resize
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update]);

  const floatingStyles: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
  };

  return { triggerRef, floatingRef, position, floatingStyles };
}

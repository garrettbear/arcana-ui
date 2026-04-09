import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

/** Position in pixels, relative to the `relativeTo` element */
export interface DragPosition {
  /** Horizontal offset from element left edge */
  x: number;
  /** Vertical offset from element top edge */
  y: number;
}

export interface UseDragOptions {
  /** Called once when dragging starts */
  onDragStart?: (position: DragPosition) => void;
  /** Called on every move while dragging */
  onDrag: (position: DragPosition) => void;
  /** Called when the user releases */
  onDragEnd?: (position: DragPosition) => void;
  /** Coordinates are relative to this element's bounding rect (defaults to event target) */
  relativeTo?: RefObject<HTMLElement | null>;
  /** Throttle move events with requestAnimationFrame (default `true`) */
  throttle?: boolean;
}

export interface UseDragReturn {
  /** Attach to the draggable element's onMouseDown */
  onMouseDown: (e: React.MouseEvent) => void;
  /** Attach to the draggable element's onTouchStart */
  onTouchStart: (e: React.TouchEvent) => void;
  /** Whether a drag is currently in progress */
  isDragging: boolean;
}

function getPosition(clientX: number, clientY: number, el: HTMLElement): DragPosition {
  const rect = el.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

/**
 * Generic drag interaction hook.
 *
 * Handles mousedown/touchstart → document mousemove/touchmove → mouseup/touchend
 * with optional RAF throttling and coordinate normalization.
 *
 * @example
 * ```tsx
 * const sliderRef = useRef<HTMLDivElement>(null);
 * const { onMouseDown, onTouchStart } = useDrag({
 *   onDrag: (pos) => setValue(pos.x / sliderRef.current!.offsetWidth),
 *   relativeTo: sliderRef,
 * });
 * <div ref={sliderRef} onMouseDown={onMouseDown} onTouchStart={onTouchStart} />
 * ```
 */
export function useDrag(options: UseDragOptions): UseDragReturn {
  const { onDragStart, onDrag, onDragEnd, relativeTo, throttle = true } = options;

  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  // Store latest callbacks in refs to avoid stale closures
  const onDragRef = useRef(onDrag);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  const relativeToRef = useRef(relativeTo);

  useEffect(() => {
    onDragRef.current = onDrag;
  }, [onDrag]);
  useEffect(() => {
    onDragStartRef.current = onDragStart;
  }, [onDragStart]);
  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);
  useEffect(() => {
    relativeToRef.current = relativeTo;
  }, [relativeTo]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getElement = useCallback((fallback: EventTarget | null): HTMLElement | null => {
    if (relativeToRef.current?.current) return relativeToRef.current.current;
    return fallback instanceof HTMLElement ? fallback : null;
  }, []);

  const startDrag = useCallback(
    (clientX: number, clientY: number, target: EventTarget | null) => {
      const el = getElement(target);
      if (!el) return;

      dragging.current = true;
      setIsDragging(true);
      const pos = getPosition(clientX, clientY, el);
      onDragStartRef.current?.(pos);
      onDragRef.current(pos);

      const handleMove = (cx: number, cy: number) => {
        if (!dragging.current) return;
        const fire = () => {
          const el2 = getElement(target);
          if (!el2) return;
          onDragRef.current(getPosition(cx, cy, el2));
        };
        if (throttle) {
          if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(fire);
        } else {
          fire();
        }
      };

      const handleEnd = (cx: number, cy: number) => {
        dragging.current = false;
        setIsDragging(false);
        const el2 = getElement(target);
        if (el2) onDragEndRef.current?.(getPosition(cx, cy, el2));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        cleanup();
      };

      const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX, ev.clientY);
      const onMouseUp = (ev: MouseEvent) => handleEnd(ev.clientX, ev.clientY);
      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches.length > 0) {
          handleMove(ev.touches[0].clientX, ev.touches[0].clientY);
        }
      };
      const onTouchEnd = (ev: TouchEvent) => {
        const touch = ev.changedTouches[0];
        handleEnd(touch?.clientX ?? 0, touch?.clientY ?? 0);
      };

      const cleanup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd);
    },
    [getElement, throttle],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startDrag(e.clientX, e.clientY, e.currentTarget);
    },
    [startDrag],
  );

  const onTouchStartHandler = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
      }
    },
    [startDrag],
  );

  return { onMouseDown, onTouchStart: onTouchStartHandler, isDragging };
}

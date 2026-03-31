import { type RefObject, useEffect } from 'react';

/**
 * Fires a callback when a click (mousedown) occurs outside of the referenced element.
 * SSR-safe: does nothing when `document` is unavailable.
 *
 * @param ref - Ref to the element that defines "inside"
 * @param callback - Called when a click lands outside
 * @param enabled - Controls whether the listener is active (default `true`)
 *
 * @example
 * ```tsx
 * const popupRef = useRef<HTMLDivElement>(null);
 * useClickOutside(popupRef, () => setOpen(false), open);
 * ```
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback, enabled]);
}

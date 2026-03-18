import { useCallback, useEffect } from 'react';

/**
 * Hook to listen for keyboard shortcuts.
 * Automatically handles Cmd (Mac) vs Ctrl (Windows/Linux) when modifier includes "meta".
 * Does not fire when user is typing in an input, textarea, or contenteditable.
 *
 * @param key - The key to listen for (e.g., "k", "s", "Enter")
 * @param callback - Function to call when the hotkey is pressed
 * @param options - Configuration options
 */
export function useHotkey(
  key: string,
  callback: () => void,
  options: {
    /** Modifier key(s) — "meta" maps to Cmd on Mac and Ctrl on others */
    modifier?: 'meta' | 'ctrl' | 'alt' | 'shift' | 'meta+shift' | 'ctrl+shift';
    /** Whether the hotkey is active */
    enabled?: boolean;
  } = {},
): void {
  const { modifier, enabled = true } = options;

  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire in editable elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      // Check modifiers
      if (modifier) {
        const mods = modifier.split('+');
        const needsMeta = mods.includes('meta');
        const needsCtrl = mods.includes('ctrl');
        const needsAlt = mods.includes('alt');
        const needsShift = mods.includes('shift');

        // "meta" matches both Cmd (Mac) and Ctrl (others)
        if (needsMeta && !(e.metaKey || e.ctrlKey)) return;
        if (needsCtrl && !e.ctrlKey) return;
        if (needsAlt && !e.altKey) return;
        if (needsShift && !e.shiftKey) return;

        // Ensure no extra modifiers are pressed (except for meta/ctrl interchangeability)
        if (!needsMeta && !needsCtrl && (e.metaKey || e.ctrlKey)) return;
        if (!needsAlt && e.altKey) return;
        if (!needsShift && e.shiftKey) return;
      } else {
        // No modifier expected — reject if any modifier is pressed
        if (e.metaKey || e.ctrlKey || e.altKey) return;
      }

      e.preventDefault();
      callback();
    },
    [key, modifier, callback],
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [enabled, handler]);
}

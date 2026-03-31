import { useCallback, useRef, useState } from 'react';

export interface UseUndoRedoReturn<T> {
  /** Push a new state onto the history stack */
  push: (state: T) => void;
  /** Move back one entry, returns the entry or undefined */
  undo: () => T | undefined;
  /** Move forward one entry, returns the entry or undefined */
  redo: () => T | undefined;
  /** Whether there is a previous entry to undo */
  canUndo: boolean;
  /** Whether there is a next entry to redo */
  canRedo: boolean;
  /** Reset the entire history */
  clear: () => void;
}

/**
 * Generic undo/redo history stack.
 *
 * New pushes after an undo clear the forward (redo) history.
 * Stack size is bounded by `maxHistory`.
 *
 * @param options.maxHistory - Maximum number of entries to keep (default 50)
 *
 * @example
 * ```tsx
 * const history = useUndoRedo<{ key: string; value: string }>({ maxHistory: 30 });
 * history.push({ key: '--color-bg', value: '#fff' });
 * const prev = history.undo(); // returns the entry
 * ```
 */
export function useUndoRedo<T>(options?: {
  /** Maximum number of history entries (default 50) */
  maxHistory?: number;
}): UseUndoRedoReturn<T> {
  const maxHistory = options?.maxHistory ?? 50;
  const stack = useRef<T[]>([]);
  const index = useRef(-1);
  const [, forceUpdate] = useState(0);

  const push = useCallback(
    (state: T) => {
      // Trim redo branch
      stack.current = stack.current.slice(0, index.current + 1);
      stack.current.push(state);
      if (stack.current.length > maxHistory) {
        stack.current.shift();
      }
      index.current = stack.current.length - 1;
      forceUpdate((n) => n + 1);
    },
    [maxHistory],
  );

  const undo = useCallback((): T | undefined => {
    if (index.current < 0) return undefined;
    const entry = stack.current[index.current];
    index.current -= 1;
    forceUpdate((n) => n + 1);
    return entry;
  }, []);

  const redo = useCallback((): T | undefined => {
    if (index.current >= stack.current.length - 1) return undefined;
    index.current += 1;
    const entry = stack.current[index.current];
    forceUpdate((n) => n + 1);
    return entry;
  }, []);

  const clear = useCallback(() => {
    stack.current = [];
    index.current = -1;
    forceUpdate((n) => n + 1);
  }, []);

  return {
    push,
    undo,
    redo,
    canUndo: index.current >= 0,
    canRedo: index.current < stack.current.length - 1,
    clear,
  };
}

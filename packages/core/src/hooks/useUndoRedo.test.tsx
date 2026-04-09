import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  it('push/undo/redo cycle works', () => {
    const { result } = renderHook(() => useUndoRedo<string>());

    act(() => result.current.push('a'));
    act(() => result.current.push('b'));
    act(() => result.current.push('c'));

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    let entry: string | undefined;
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe('c');

    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe('b');

    expect(result.current.canRedo).toBe(true);

    act(() => {
      entry = result.current.redo();
    });
    expect(entry).toBe('b');

    act(() => {
      entry = result.current.redo();
    });
    expect(entry).toBe('c');

    expect(result.current.canRedo).toBe(false);
  });

  it('canUndo/canRedo flags are correct', () => {
    const { result } = renderHook(() => useUndoRedo<number>());

    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);

    act(() => result.current.push(1));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.undo();
    });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it('maxHistory limits the stack', () => {
    const { result } = renderHook(() => useUndoRedo<number>({ maxHistory: 3 }));

    act(() => result.current.push(1));
    act(() => result.current.push(2));
    act(() => result.current.push(3));
    act(() => result.current.push(4));

    // Only 3 entries: 2, 3, 4 — entry 1 was dropped
    let entry: number | undefined;
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe(4);
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe(3);
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe(2);
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBeUndefined();
  });

  it('push after undo trims forward history', () => {
    const { result } = renderHook(() => useUndoRedo<string>());

    act(() => result.current.push('a'));
    act(() => result.current.push('b'));
    act(() => result.current.push('c'));
    act(() => {
      result.current.undo();
    }); // at 'b'
    act(() => {
      result.current.undo();
    }); // at 'a'
    act(() => result.current.push('x')); // 'b' and 'c' are gone

    expect(result.current.canRedo).toBe(false);

    let entry: string | undefined;
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe('x');
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBe('a');
    act(() => {
      entry = result.current.undo();
    });
    expect(entry).toBeUndefined();
  });

  it('clear resets the history', () => {
    const { result } = renderHook(() => useUndoRedo<number>());

    act(() => result.current.push(1));
    act(() => result.current.push(2));
    act(() => result.current.clear());

    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});

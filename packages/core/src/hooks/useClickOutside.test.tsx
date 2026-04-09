import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

function setup(enabled = true) {
  const callback = vi.fn();
  const container = document.createElement('div');
  document.body.appendChild(container);

  const { unmount } = renderHook(() => {
    const ref = useRef<HTMLDivElement>(container);
    useClickOutside(ref, callback, enabled);
  });

  return { callback, container, unmount };
}

describe('useClickOutside', () => {
  it('fires callback on outside click', () => {
    const { callback } = setup();
    const outsideEl = document.createElement('span');
    document.body.appendChild(outsideEl);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(callback).toHaveBeenCalledTimes(1);

    outsideEl.remove();
  });

  it('does not fire on inside click', () => {
    const { callback, container } = setup();

    container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('respects enabled flag', () => {
    const { callback } = setup(false);

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { callback, unmount } = setup();

    unmount();
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });
});

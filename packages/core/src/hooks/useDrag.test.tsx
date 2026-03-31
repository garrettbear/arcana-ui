import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDrag } from './useDrag';

function TestDragTarget({
  onDrag,
  onDragStart,
  onDragEnd,
}: {
  onDrag: (pos: { x: number; y: number }) => void;
  onDragStart?: (pos: { x: number; y: number }) => void;
  onDragEnd?: (pos: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { onMouseDown, onTouchStart, isDragging } = useDrag({
    onDrag,
    onDragStart,
    onDragEnd,
    relativeTo: ref,
    throttle: false,
  });

  return (
    <div
      ref={ref}
      data-testid="target"
      data-dragging={isDragging}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ width: 200, height: 100 }}
    />
  );
}

describe('useDrag', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fires onDrag with position on mousedown', () => {
    const onDrag = vi.fn();
    render(<TestDragTarget onDrag={onDrag} />);
    const target = screen.getByTestId('target');

    // Mock getBoundingClientRect
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseDown(target, { clientX: 50, clientY: 25 });
    expect(onDrag).toHaveBeenCalledWith({ x: 50, y: 25 });
  });

  it('fires onDragEnd on mouseup', () => {
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    render(<TestDragTarget onDrag={onDrag} onDragEnd={onDragEnd} />);
    const target = screen.getByTestId('target');

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseDown(target, { clientX: 50, clientY: 25 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 50 }));
    });
    expect(onDragEnd).toHaveBeenCalled();
  });

  it('tracks isDragging state', () => {
    const onDrag = vi.fn();
    render(<TestDragTarget onDrag={onDrag} />);
    const target = screen.getByTestId('target');

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    expect(target.dataset.dragging).toBe('false');
    fireEvent.mouseDown(target, { clientX: 50, clientY: 25 });
    expect(target.dataset.dragging).toBe('true');

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, clientY: 25 }));
    });
    expect(target.dataset.dragging).toBe('false');
  });

  it('cleans up listeners on mouseup', () => {
    const onDrag = vi.fn();
    render(<TestDragTarget onDrag={onDrag} />);
    const target = screen.getByTestId('target');

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseDown(target, { clientX: 50, clientY: 25 });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, clientY: 25 }));
    });

    // After mouseup, further mousemoves should not fire onDrag
    const callCount = onDrag.mock.calls.length;
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 75 }));
    });
    expect(onDrag.mock.calls.length).toBe(callCount);
  });

  it('fires onDragStart on initial interaction', () => {
    const onDrag = vi.fn();
    const onDragStart = vi.fn();
    render(<TestDragTarget onDrag={onDrag} onDragStart={onDragStart} />);
    const target = screen.getByTestId('target');

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseDown(target, { clientX: 30, clientY: 15 });
    expect(onDragStart).toHaveBeenCalledWith({ x: 30, y: 15 });
  });
});

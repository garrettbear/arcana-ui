/**
 * CubicBezierEditor — visual cubic bezier curve editor
 *
 * Shows a canvas with the bezier curve drawn from P0(0,0) to P3(1,1)
 * with two draggable control points P1(x1,y1) and P2(x2,y2).
 *
 * Below the canvas: preset buttons with animation previews, plus
 * a live animation dot demo.
 */

import { useMediaQuery, usePrefersReducedMotion } from '@arcana-ui/core';
import type React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './CubicBezierEditor.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BezierValues {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CubicBezierEditorProps {
  /** Current cubic-bezier values */
  values: BezierValues;
  onChange: (values: BezierValues, cssString: string) => void;
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export const BEZIER_PRESETS: Array<{ label: string; values: BezierValues; css: string }> = [
  { label: 'Linear', values: { x1: 0, y1: 0, x2: 1, y2: 1 }, css: 'linear' },
  { label: 'Ease', values: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 }, css: 'ease' },
  { label: 'Ease In', values: { x1: 0.42, y1: 0, x2: 1, y2: 1 }, css: 'ease-in' },
  { label: 'Ease Out', values: { x1: 0, y1: 0, x2: 0.58, y2: 1 }, css: 'ease-out' },
  { label: 'In-Out', values: { x1: 0.42, y1: 0, x2: 0.58, y2: 1 }, css: 'ease-in-out' },
  {
    label: 'Spring',
    values: { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
    css: 'cubic-bezier(0.34,1.56,0.64,1)',
  },
  {
    label: 'Bounce',
    values: { x1: 0.68, y1: -0.55, x2: 0.265, y2: 1.55 },
    css: 'cubic-bezier(0.68,-0.55,0.265,1.55)',
  },
];

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawBezier(
  ctx: CanvasRenderingContext2D,
  size: number,
  bv: BezierValues,
  isDark: boolean,
): void {
  const pad = 16;
  const w = size - pad * 2;
  const h = size - pad * 2;

  ctx.clearRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const x = pad + (w / 4) * i;
    const y = pad + (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, pad);
    ctx.lineTo(x, pad + h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + w, y);
    ctx.stroke();
  }

  // Diagonal reference (linear)
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad, pad + h);
  ctx.lineTo(pad + w, pad);
  ctx.stroke();
  ctx.setLineDash([]);

  // Convert normalized coords to canvas coords
  const cx = (x: number) => pad + x * w;
  const cy = (y: number) => pad + h - y * h;

  const p0x = cx(0);
  const p0y = cy(0);
  const p1x = cx(bv.x1);
  const p1y = cy(bv.y1);
  const p2x = cx(bv.x2);
  const p2y = cy(bv.y2);
  const p3x = cx(1);
  const p3y = cy(1);

  // Control lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p0x, p0y);
  ctx.lineTo(p1x, p1y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p3x, p3y);
  ctx.lineTo(p2x, p2y);
  ctx.stroke();

  // Curve
  ctx.strokeStyle = 'var(--color-action-primary)';
  // Fallback for canvas (CSS vars don't work in canvas fillStyle, use a computed value)
  ctx.strokeStyle =
    getComputedStyle(document.documentElement).getPropertyValue('--color-action-primary').trim() ||
    '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(p0x, p0y);
  ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
  ctx.stroke();

  // Control points
  const drawPoint = (x: number, y: number, filled: boolean) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    const accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-action-primary')
        .trim() || '#6366f1';
    ctx.fillStyle = filled ? accentColor : isDark ? '#1e1e2e' : '#fff';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  };

  // Fixed endpoints
  ctx.beginPath();
  ctx.arc(p0x, p0y, 4, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p3x, p3y, 4, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  ctx.fill();

  // Draggable control points
  drawPoint(p1x, p1y, false);
  drawPoint(p2x, p2y, true);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CubicBezierEditor({
  values,
  onChange,
}: CubicBezierEditorProps): React.ReactElement {
  const SIZE = 140;
  const PAD = 16;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draggingPoint = useRef<'p1' | 'p2' | null>(null);
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = usePrefersReducedMotion();

  const [animating, setAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const animFrameRef = useRef<number | undefined>(undefined);

  const buildCss = (bv: BezierValues): string => {
    // Check if matches a named preset
    for (const p of BEZIER_PRESETS) {
      if (
        Math.abs(p.values.x1 - bv.x1) < 0.001 &&
        Math.abs(p.values.y1 - bv.y1) < 0.001 &&
        Math.abs(p.values.x2 - bv.x2) < 0.001 &&
        Math.abs(p.values.y2 - bv.y2) < 0.001
      ) {
        return p.css;
      }
    }
    return `cubic-bezier(${bv.x1.toFixed(3)},${bv.y1.toFixed(3)},${bv.x2.toFixed(3)},${bv.y2.toFixed(3)})`;
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBezier(ctx, SIZE, values, isDark);
  }, [values, isDark]);

  useLayoutEffect(() => {
    redraw();
  }, [redraw]);

  // ── Drag ──────────────────────────────────────────────────────────────────

  const getCanvasCoords = (
    e: MouseEvent | React.MouseEvent,
    canvas: HTMLCanvasElement,
  ): { nx: number; ny: number } => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const w = SIZE - PAD * 2;
    const h = SIZE - PAD * 2;
    const nx = Math.max(0, Math.min(1, (cx - PAD) / w));
    const ny = Math.max(-0.5, Math.min(1.5, 1 - (cy - PAD) / h));
    return { nx, ny };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = SIZE - PAD * 2;
    const h = SIZE - PAD * 2;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const p1x = PAD + values.x1 * w;
    const p1y = PAD + h - values.y1 * h;
    const p2x = PAD + values.x2 * w;
    const p2y = PAD + h - values.y2 * h;

    const d1 = Math.hypot(mx - p1x, my - p1y);
    const d2 = Math.hypot(mx - p2x, my - p2y);

    if (d1 < 12) draggingPoint.current = 'p1';
    else if (d2 < 12) draggingPoint.current = 'p2';
    else return;

    const onMove = (ev: MouseEvent) => {
      if (!draggingPoint.current || !canvas) return;
      const { nx, ny } = getCanvasCoords(ev, canvas);
      const newValues: BezierValues =
        draggingPoint.current === 'p1'
          ? { ...values, x1: Math.max(0, Math.min(1, nx)), y1: ny }
          : { ...values, x2: Math.max(0, Math.min(1, nx)), y2: ny };
      onChange(newValues, buildCss(newValues));
    };

    const onUp = () => {
      draggingPoint.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── Animation preview ─────────────────────────────────────────────────────

  const playAnimation = () => {
    if (animating || prefersReducedMotion) return;
    setAnimating(true);
    setAnimProgress(0);

    const duration = 600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        setAnimProgress(1);
        setTimeout(() => {
          setAnimating(false);
          setAnimProgress(0);
        }, 300);
        return;
      }
      setAnimProgress(elapsed / duration);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── Number inputs ─────────────────────────────────────────────────────────

  const handleInputChange = (key: keyof BezierValues, val: string) => {
    const n = Math.max(-2, Math.min(2, Number.parseFloat(val) || 0));
    // x1, x2 must be 0-1
    const clamped = key === 'x1' || key === 'x2' ? Math.max(0, Math.min(1, n)) : n;
    const newValues = { ...values, [key]: clamped };
    onChange(newValues, buildCss(newValues));
  };

  const cssCurve = buildCss(values);

  return (
    <div className={styles.root}>
      {/* Canvas */}
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className={styles.canvas}
          onMouseDown={handleCanvasMouseDown}
        />
      </div>

      {/* Number inputs */}
      <div className={styles.inputGrid}>
        {(['x1', 'y1', 'x2', 'y2'] as const).map((key) => (
          <div key={key} className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor={`bezier-${key}`}>
              {key}
            </label>
            <input
              id={`bezier-${key}`}
              type="number"
              className={styles.input}
              min={key === 'x1' || key === 'x2' ? 0 : -2}
              max={key === 'x1' || key === 'x2' ? 1 : 2}
              step={0.01}
              value={values[key].toFixed(3)}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div className={styles.cssOutput}>{cssCurve}</div>

      {/* Animation preview */}
      <div className={styles.preview}>
        <div className={styles.previewTrack}>
          <div
            className={styles.previewDot}
            style={{
              transform: `translateX(${animProgress * 124}px)`,
              transition: animating ? `transform 600ms ${cssCurve}` : 'none',
            }}
          />
        </div>
        <button
          type="button"
          className={styles.playBtn}
          onClick={playAnimation}
          disabled={animating}
        >
          ▶
        </button>
      </div>

      {/* Presets */}
      <div className={styles.presets}>
        {BEZIER_PRESETS.map((p) => {
          const active =
            Math.abs(p.values.x1 - values.x1) < 0.01 &&
            Math.abs(p.values.y1 - values.y1) < 0.01 &&
            Math.abs(p.values.x2 - values.x2) < 0.01 &&
            Math.abs(p.values.y2 - values.y2) < 0.01;
          return (
            <button
              type="button"
              key={p.label}
              className={`${styles.presetBtn} ${active ? styles.presetActive : ''}`}
              onClick={() => onChange(p.values, p.css)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

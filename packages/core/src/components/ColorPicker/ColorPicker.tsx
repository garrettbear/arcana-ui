/**
 * ColorPicker — Full-featured HSV color picker
 *
 * Features:
 * - Saturation/value canvas (2D)
 * - Hue slider
 * - Alpha slider
 * - Hex input (editable)
 * - R, G, B number inputs
 * - Recent colors (last 8)
 * - EyeDropper API (Chrome 95+)
 * - Preset palette (theme swatches)
 *
 * All changes fire onChange in real-time (no "apply" button).
 * Uses useDrag hook for drag performance.
 */

import type React from 'react';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useDrag } from '../../hooks/useDrag';
import { useFloating } from '../../hooks/useFloating';
import { cn } from '../../utils/cn';
import styles from './ColorPicker.module.css';

// ─── Color Math ───────────────────────────────────────────────────────────────

/** Parse a CSS hex/rgb/rgba string into [r, g, b, a] (0-255, a 0-255). */
function parseColorFull(rawStr: string): [number, number, number, number] | null {
  if (!rawStr) return null;
  const str = rawStr.trim();
  if (str === 'transparent') return [0, 0, 0, 0];
  if (/^#[0-9a-f]{3}$/i.test(str)) {
    const r = Number.parseInt(str[1] + str[1], 16);
    const g = Number.parseInt(str[2] + str[2], 16);
    const b = Number.parseInt(str[3] + str[3], 16);
    return [r, g, b, 255];
  }
  if (/^#[0-9a-f]{6}$/i.test(str)) {
    return [
      Number.parseInt(str.slice(1, 3), 16),
      Number.parseInt(str.slice(3, 5), 16),
      Number.parseInt(str.slice(5, 7), 16),
      255,
    ];
  }
  if (/^#[0-9a-f]{8}$/i.test(str)) {
    return [
      Number.parseInt(str.slice(1, 3), 16),
      Number.parseInt(str.slice(3, 5), 16),
      Number.parseInt(str.slice(5, 7), 16),
      Number.parseInt(str.slice(7, 9), 16),
    ];
  }
  const rgbMatch = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return [
      Number.parseInt(rgbMatch[1]),
      Number.parseInt(rgbMatch[2]),
      Number.parseInt(rgbMatch[3]),
      255,
    ];
  }
  const rgbaMatch = str.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbaMatch) {
    return [
      Number.parseInt(rgbaMatch[1]),
      Number.parseInt(rgbaMatch[2]),
      Number.parseInt(rgbaMatch[3]),
      Math.round(Number.parseFloat(rgbaMatch[4]) * 255),
    ];
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  if (a === 255) return rgbToHex(r, g, b);
  return `#${[r, g, b, a].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s, v };
}

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawSatValCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue: number,
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.fillRect(0, 0, width, height);
  const white = ctx.createLinearGradient(0, 0, width, 0);
  white.addColorStop(0, 'rgba(255,255,255,1)');
  white.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = white;
  ctx.fillRect(0, 0, width, height);
  const black = ctx.createLinearGradient(0, 0, 0, height);
  black.addColorStop(0, 'rgba(0,0,0,0)');
  black.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = black;
  ctx.fillRect(0, 0, width, height);
}

// ─── Recent Colors store ──────────────────────────────────────────────────────

const MAX_RECENT = 8;
const recentColorsStore: string[] = [];

function addRecentColor(hex: string): void {
  const existing = recentColorsStore.indexOf(hex);
  if (existing !== -1) recentColorsStore.splice(existing, 1);
  recentColorsStore.unshift(hex);
  if (recentColorsStore.length > MAX_RECENT) recentColorsStore.length = MAX_RECENT;
}

// ─── EyeDropper ──────────────────────────────────────────────────────────────

const supportsEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

// ─── Canvas dimensions ──────────────────────────────────────────────────────

const CANVAS_W = 192;
const CANVAS_H = 120;

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ColorPickerProps {
  /** Current CSS color value (hex, rgb, rgba) */
  value: string;
  /** Called on every change with a hex value (or rgba for semi-transparent) */
  onChange: (value: string) => void;
  /** Color output format */
  format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
  /** Show alpha/opacity slider (default true) */
  showAlpha?: boolean;
  /** Show hex/RGB text inputs (default true) */
  showInputs?: boolean;
  /** Show eyedropper button when supported (default true) */
  showEyeDropper?: boolean;
  /** Optional palette swatches (e.g. current theme colors) */
  presetColors?: string[];
  /** Track and show recent colors (default true) */
  showRecent?: boolean;
  /** Placement of popup relative to trigger */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      onChange,
      format = 'hex',
      showAlpha = true,
      showInputs = true,
      showEyeDropper: showEyeDropperProp = true,
      presetColors = [],
      showRecent = true,
      placement = 'bottom',
      size = 'md',
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    // Merge forwarded ref with local ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const {
      triggerRef: swatchRef,
      floatingRef: popupRef,
      floatingStyles,
    } = useFloating<HTMLButtonElement, HTMLDivElement>({
      open,
      placement,
      alignment: 'start',
      offset: 6,
    });

    // Click outside to close
    useClickOutside(rootRef, () => setOpen(false), open);

    // ── State ──────────────────────────────────────────────────────────────

    const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>({
      h: 210,
      s: 0.7,
      v: 0.9,
    });
    const [alpha, setAlpha] = useState(255);
    const [hexInput, setHexInput] = useState('#000000');
    const [rgbInputs, setRgbInputs] = useState<[number, number, number]>([0, 0, 0]);
    const [recentColors, setRecentColors] = useState<string[]>([...recentColorsStore]);

    // ── Sync from value prop ──────────────────────────────────────────────

    const syncFromValue = useCallback((val: string) => {
      const parsed = parseColorFull(val);
      if (!parsed) return;
      const [r, g, b, a] = parsed;
      const hsv_ = rgbToHsv(r, g, b);
      setHsv(hsv_);
      setAlpha(a);
      setHexInput(rgbToHex(r, g, b));
      setRgbInputs([r, g, b]);
    }, []);

    useEffect(() => {
      if (open) syncFromValue(value);
    }, [open, value, syncFromValue]);

    // ── Canvas ─────────────────────────────────────────────────────────────

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const redrawCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawSatValCanvas(ctx, canvas.width, canvas.height, hsv.h);
    }, [hsv.h]);

    useLayoutEffect(() => {
      if (open) redrawCanvas();
    }, [open, redrawCanvas]);

    // ── Output formatting ─────────────────────────────────────────────────

    const formatOutput = useCallback(
      (r: number, g: number, b: number, a: number): string => {
        if (a < 255 || format === 'rgba') {
          return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
        }
        if (format === 'rgb') return `rgb(${r},${g},${b})`;
        return rgbToHex(r, g, b);
      },
      [format],
    );

    // ── Canvas drag (saturation/value) ──────────────────────────────────

    const canvasWrapRef = useRef<HTMLDivElement | null>(null);

    const applySV = useCallback(
      (s: number, v: number) => {
        const newHsv = { ...hsv, s, v };
        const [r, g, b] = hsvToRgb(newHsv.h, s, v);
        setHsv(newHsv);
        setHexInput(rgbToHex(r, g, b));
        setRgbInputs([r, g, b]);
        onChange(formatOutput(r, g, b, alpha));
      },
      [hsv, alpha, onChange, formatOutput],
    );

    const svDrag = useDrag({
      onDrag: useCallback(
        (pos) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const s = Math.max(0, Math.min(1, pos.x / rect.width));
          const v = Math.max(0, Math.min(1, 1 - pos.y / rect.height));
          applySV(s, v);
        },
        [applySV],
      ),
      relativeTo: canvasWrapRef,
      throttle: true,
    });

    // ── Hue slider drag ─────────────────────────────────────────────────

    const hueRef = useRef<HTMLDivElement | null>(null);

    const applyHue = useCallback(
      (h: number) => {
        const newHsv = { ...hsv, h };
        const [r, g, b] = hsvToRgb(h, newHsv.s, newHsv.v);
        setHsv(newHsv);
        setHexInput(rgbToHex(r, g, b));
        setRgbInputs([r, g, b]);
        onChange(formatOutput(r, g, b, alpha));
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) drawSatValCanvas(ctx, canvas.width, canvas.height, h);
        }
      },
      [hsv, alpha, onChange, formatOutput],
    );

    const hueDrag = useDrag({
      onDrag: useCallback(
        (pos) => {
          const el = hueRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const h = Math.max(0, Math.min(360, (pos.x / rect.width) * 360));
          applyHue(h);
        },
        [applyHue],
      ),
      relativeTo: hueRef,
      throttle: true,
    });

    // ── Alpha slider drag ───────────────────────────────────────────────

    const alphaRef = useRef<HTMLDivElement | null>(null);

    const applyAlpha = useCallback(
      (a: number) => {
        setAlpha(a);
        const [r, g, b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
        onChange(formatOutput(r, g, b, a));
      },
      [hsv, onChange, formatOutput],
    );

    const alphaDrag = useDrag({
      onDrag: useCallback(
        (pos) => {
          const el = alphaRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const a = Math.max(0, Math.min(255, Math.round((pos.x / rect.width) * 255)));
          applyAlpha(a);
        },
        [applyAlpha],
      ),
      relativeTo: alphaRef,
      throttle: true,
    });

    // ── Hex input ─────────────────────────────────────────────────────────

    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHexInput(val);
      const cleaned = val.startsWith('#') ? val : `#${val}`;
      if (/^#[0-9a-f]{6}$/i.test(cleaned)) {
        const parsed = parseColorFull(cleaned);
        if (!parsed) return;
        const [r, g, b] = parsed;
        const newHsv = rgbToHsv(r, g, b);
        setHsv(newHsv);
        setRgbInputs([r, g, b]);
        onChange(formatOutput(r, g, b, alpha));
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) drawSatValCanvas(ctx, canvas.width, canvas.height, newHsv.h);
        }
      }
    };

    const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const cleaned = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
        if (/^#[0-9a-f]{6}$/i.test(cleaned)) {
          setHexInput(cleaned);
        }
      }
    };

    // ── RGB inputs ────────────────────────────────────────────────────────

    const handleRgbChange = (channel: 0 | 1 | 2, val: string) => {
      const n = Math.max(0, Math.min(255, Number.parseInt(val) || 0));
      const newRgb: [number, number, number] = [...rgbInputs] as [number, number, number];
      newRgb[channel] = n;
      setRgbInputs(newRgb);
      const [r, g, b] = newRgb;
      const newHsv = rgbToHsv(r, g, b);
      setHsv(newHsv);
      setHexInput(rgbToHex(r, g, b));
      onChange(formatOutput(r, g, b, alpha));
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawSatValCanvas(ctx, canvas.width, canvas.height, newHsv.h);
      }
    };

    // ── Eyedropper ────────────────────────────────────────────────────────

    const handleEyeDropper = async () => {
      try {
        // @ts-expect-error EyeDropper is a Chrome-only experimental API
        const ed = new window.EyeDropper();
        const result = (await ed.open()) as { sRGBHex: string };
        const hex = result.sRGBHex;
        const parsed = parseColorFull(hex);
        if (!parsed) return;
        const [r, g, b] = parsed;
        const newHsv = rgbToHsv(r, g, b);
        setHsv(newHsv);
        setHexInput(hex);
        setRgbInputs([r, g, b]);
        setAlpha(255);
        onChange(hex);
        addRecentColor(hex);
        setRecentColors([...recentColorsStore]);
      } catch {
        // User cancelled or not supported
      }
    };

    // ── Close + track recent ──────────────────────────────────────────────

    const handleClose = () => {
      setOpen(false);
      const hex = rgbToHex(...rgbInputs);
      addRecentColor(hex);
      setRecentColors([...recentColorsStore]);
    };

    const handleSwatchClick = (color: string) => {
      syncFromValue(color);
      onChange(color);
    };

    // ── Derived values ────────────────────────────────────────────────────

    const cursorX = hsv.s * CANVAS_W;
    const cursorY = (1 - hsv.v) * CANVAS_H;
    const huePercent = (hsv.h / 360) * 100;
    const alphaPercent = (alpha / 255) * 100;
    const currentHex = rgbToHex(...rgbInputs);
    const alphaColor = `rgba(${rgbInputs[0]},${rgbInputs[1]},${rgbInputs[2]},`;

    const sizeClass = size !== 'md' ? styles[`root--${size}`] : '';

    return (
      <div ref={setRefs} className={cn(styles.root, sizeClass, className)}>
        {/* Trigger swatch */}
        <button
          ref={swatchRef}
          type="button"
          className={styles.swatch}
          style={{ background: value }}
          onClick={() => (open ? handleClose() : setOpen(true))}
          disabled={disabled}
          aria-label={`Color picker: ${value}`}
          aria-expanded={open}
        />

        {/* Popup */}
        {open && (
          <div ref={popupRef} className={styles.popup} style={floatingStyles}>
            {/* Saturation/Value canvas */}
            <div ref={canvasWrapRef} className={styles.canvasWrap}>
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className={styles.canvas}
                onMouseDown={svDrag.onMouseDown}
                onTouchStart={svDrag.onTouchStart}
              />
              <div
                className={styles.cursor}
                style={{
                  left: `${cursorX}px`,
                  top: `${cursorY}px`,
                  borderColor: cursorY > 60 ? '#fff' : '#333',
                }}
              />
            </div>

            {/* Sliders row */}
            <div className={styles.slidersRow}>
              <div className={styles.previewSwatch} style={{ background: currentHex }} />
              <div className={styles.sliders}>
                {/* Hue */}
                <div
                  ref={hueRef}
                  className={styles.hueSlider}
                  onMouseDown={hueDrag.onMouseDown}
                  onTouchStart={hueDrag.onTouchStart}
                >
                  <div
                    className={styles.sliderThumb}
                    style={{ left: `calc(${huePercent}% - 6px)` }}
                  />
                </div>
                {/* Alpha */}
                {showAlpha && (
                  <div
                    ref={alphaRef}
                    className={styles.alphaSlider}
                    onMouseDown={alphaDrag.onMouseDown}
                    onTouchStart={alphaDrag.onTouchStart}
                    style={
                      {
                        '--alpha-color-start': `${alphaColor}0)`,
                        '--alpha-color-end': `${alphaColor}1)`,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className={styles.sliderThumb}
                      style={{ left: `calc(${alphaPercent}% - 6px)` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Hex + RGB inputs */}
            {showInputs && (
              <div className={styles.inputs}>
                <div className={styles.hexWrap}>
                  <input
                    type="text"
                    className={styles.hexInput}
                    value={hexInput}
                    onChange={handleHexInputChange}
                    onKeyDown={handleHexKeyDown}
                    spellCheck={false}
                    maxLength={9}
                  />
                  <span className={styles.inputLabel}>Hex</span>
                </div>
                {(['R', 'G', 'B'] as const).map((ch, i) => (
                  <div key={ch} className={styles.rgbWrap}>
                    <input
                      type="number"
                      className={styles.rgbInput}
                      min={0}
                      max={255}
                      value={rgbInputs[i]}
                      onChange={(e) => handleRgbChange(i as 0 | 1 | 2, e.target.value)}
                    />
                    <span className={styles.inputLabel}>{ch}</span>
                  </div>
                ))}
                {showAlpha && (
                  <div className={styles.rgbWrap}>
                    <input
                      type="number"
                      className={styles.rgbInput}
                      min={0}
                      max={100}
                      value={Math.round((alpha / 255) * 100)}
                      onChange={(e) =>
                        applyAlpha(Math.round((Number.parseInt(e.target.value) / 100) * 255))
                      }
                    />
                    <span className={styles.inputLabel}>A%</span>
                  </div>
                )}
              </div>
            )}

            {/* Eyedropper */}
            {showEyeDropperProp && supportsEyeDropper && (
              <div className={styles.actionsRow}>
                <button
                  type="button"
                  className={styles.eyedropperBtn}
                  onClick={handleEyeDropper}
                  title="Pick color from screen"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 22l8.5-8.5" />
                    <path d="M18 3l3 3-9.5 9.5-3-3z" />
                    <circle cx="3.5" cy="20.5" r="1.5" />
                  </svg>
                  Eyedropper
                </button>
              </div>
            )}

            {/* Recent colors */}
            {showRecent && recentColors.length > 0 && (
              <div className={styles.swatchRow}>
                <span className={styles.swatchRowLabel}>Recent</span>
                <div className={styles.swatchList}>
                  {recentColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn(styles.miniSwatch, c === currentHex && styles.miniSwatchActive)}
                      style={{ background: c }}
                      onClick={() => handleSwatchClick(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Preset palette */}
            {presetColors.length > 0 && (
              <div className={styles.swatchRow}>
                <span className={styles.swatchRowLabel}>Theme</span>
                <div className={styles.swatchList}>
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn(styles.miniSwatch, c === currentHex && styles.miniSwatchActive)}
                      style={{ background: c }}
                      onClick={() => handleSwatchClick(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
ColorPicker.displayName = 'ColorPicker';

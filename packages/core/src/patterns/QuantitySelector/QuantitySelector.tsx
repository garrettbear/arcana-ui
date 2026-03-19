import React, { useCallback, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './QuantitySelector.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuantitySelectorProps {
  /** Current quantity value */
  value: number;
  /** Callback fired when the value changes */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const QuantitySelector = React.forwardRef<HTMLDivElement, QuantitySelectorProps>(
  (
    { value, onChange, min = 1, max = 99, size = 'md', disabled = false, className, ...props },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    const clamp = useCallback(
      (v: number): number => Math.min(max, Math.max(min, Math.round(v))),
      [min, max],
    );

    const handleDecrement = useCallback(() => {
      const next = clamp(value - 1);
      if (next !== value) {
        onChange(next);
        setInputValue(String(next));
      }
    }, [value, onChange, clamp]);

    const handleIncrement = useCallback(() => {
      const next = clamp(value + 1);
      if (next !== value) {
        onChange(next);
        setInputValue(String(next));
      }
    }, [value, onChange, clamp]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    }, []);

    const handleBlur = useCallback(() => {
      const parsed = Number.parseInt(inputValue, 10);
      if (Number.isNaN(parsed)) {
        setInputValue(String(value));
        return;
      }
      const clamped = clamp(parsed);
      setInputValue(String(clamped));
      if (clamped !== value) {
        onChange(clamped);
      }
    }, [inputValue, value, onChange, clamp]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
    }, []);

    // Sync inputValue when value prop changes externally
    const prevValueRef = useRef(value);
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setInputValue(String(value));
    }

    const atMin = value <= min;
    const atMax = value >= max;

    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[`size-${size}`], disabled && styles.disabled, className)}
        {...props}
      >
        <button
          type="button"
          className={styles.button}
          onClick={handleDecrement}
          disabled={disabled || atMin}
          aria-label="Decrease quantity"
          tabIndex={-1}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Quantity"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          role="spinbutton"
        />
        <button
          type="button"
          className={styles.button}
          onClick={handleIncrement}
          disabled={disabled || atMax}
          aria-label="Increase quantity"
          tabIndex={-1}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    );
  },
);
QuantitySelector.displayName = 'QuantitySelector';

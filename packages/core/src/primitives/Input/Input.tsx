import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix' | 'size'> {
  /** Label text displayed above the input */
  label?: string;
  /** Size of the input */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Error message string or boolean error state */
  error?: string | boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Element rendered before the input field */
  prefix?: React.ReactNode;
  /** Element rendered after the input field */
  suffix?: React.ReactNode;
  /** Whether the input stretches to fill its container */
  fullWidth?: boolean;
  /** Whether the input is required (shows indicator on label) */
  required?: boolean;
  /** Additional className for the outer wrapper containing border and focus ring */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      prefix,
      suffix,
      fullWidth = false,
      required,
      id,
      className,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            styles.inputWrapper,
            size !== 'md' && styles[`size-${size}`],
            hasError && styles.hasError,
            disabled && styles.disabled,
            wrapperClassName,
          )}
        >
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorMessage && errorId, helperText && helperId].filter(Boolean).join(' ') ||
              undefined
            }
            className={cn(styles.input, className)}
            {...props}
          />
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>

        {errorMessage && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </span>
        )}
        {helperText && !errorMessage && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

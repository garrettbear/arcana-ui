import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Input.module.css'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string
  error?: string | boolean
  helperText?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      fullWidth = false,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined

    return (
      <div
        className={cn(
          styles.wrapper,
          fullWidth && styles.fullWidth
        )}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={cn(styles.inputWrapper, hasError && styles.hasError, disabled && styles.disabled)}>
          {prefix && (
            <span className={styles.prefix} aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorMessage && errorId, helperText && helperId]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={cn(
              styles.input,
              prefix && styles.hasPrefix,
              suffix && styles.hasSuffix,
              className
            )}
            {...props}
          />
          {suffix && (
            <span className={styles.suffix} aria-hidden="true">
              {suffix}
            </span>
          )}
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
    )
  }
)

Input.displayName = 'Input'

import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string | boolean
  helperText?: string
  placeholder?: string
  options?: SelectOption[]
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      placeholder,
      options,
      fullWidth = false,
      id,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const selectId = id ?? generatedId
    const errorId = `${selectId}-error`
    const helperId = `${selectId}-helper`

    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={cn(styles.selectWrapper, hasError && styles.hasError, disabled && styles.disabled)}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorMessage && errorId, helperText && helperId]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={cn(styles.select, className)}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
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

Select.displayName = 'Select'

import React, { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  indeterminate?: boolean
  error?: string | boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate = false, error, className, id, onChange, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const descId = `${inputId}-desc`
    const errorId = `${inputId}-error`
    const internalRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, resolvedRef])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return
      onChange?.(e)
    }

    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined

    return (
      <div className={cn(styles.wrapper, className)}>
        <div className={styles.row}>
          <div className={styles.checkboxWrapper}>
            <input
              ref={resolvedRef}
              type="checkbox"
              id={inputId}
              className={cn(styles.input, hasError && styles.hasError)}
              aria-invalid={hasError || undefined}
              aria-describedby={
                [description && descId, errorMessage && errorId].filter(Boolean).join(' ') ||
                undefined
              }
              onChange={handleChange}
              {...props}
            />
            <span className={styles.indicator} aria-hidden="true">
              {indeterminate ? (
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </div>
          {(label || description) && (
            <div className={styles.labelGroup}>
              {label && (
                <label htmlFor={inputId} className={styles.label}>
                  {label}
                </label>
              )}
              {description && (
                <span id={descId} className={styles.description}>
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

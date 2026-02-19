import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Textarea.module.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string | boolean
  helperText?: string
  autoResize?: boolean
  showCount?: boolean
  maxLength?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoResize = false,
      showCount = false,
      maxLength,
      id,
      disabled,
      className,
      onChange,
      onInput,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = id ?? generatedId
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`

    const [charCount, setCharCount] = React.useState(() => {
      if (typeof value === 'string') return value.length
      if (typeof defaultValue === 'string') return defaultValue.length
      return 0
    })

    const hasError = Boolean(error)
    const errorMessage = typeof error === 'string' ? error : undefined

    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Merge external ref with internal ref
    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        }
      },
      [ref]
    )

    const handleAutoResize = React.useCallback((el: HTMLTextAreaElement) => {
      if (autoResize) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
      }
    }, [autoResize])

    const handleInput = React.useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget
        setCharCount(el.value.length)
        handleAutoResize(el)
        onInput?.(e)
      },
      [handleAutoResize, onInput]
    )

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.currentTarget.value.length)
        onChange?.(e)
      },
      [onChange]
    )

    // Initial auto-resize on mount
    React.useEffect(() => {
      if (autoResize && internalRef.current) {
        handleAutoResize(internalRef.current)
      }
    }, [autoResize, handleAutoResize])

    const showCountDisplay = showCount && (maxLength !== undefined || showCount)

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}

        <textarea
          ref={setRef}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [errorMessage && errorId, helperText && helperId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={cn(
            styles.textarea,
            hasError && styles.hasError,
            disabled && styles.disabled,
            autoResize && styles.autoResize,
            className
          )}
          onInput={handleInput}
          onChange={handleChange}
          {...props}
        />

        <div className={styles.footer}>
          <div>
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
          {showCountDisplay && (
            <span className={cn(styles.count, maxLength && charCount >= maxLength && styles.countAtMax)}>
              {maxLength !== undefined ? `${charCount}/${maxLength}` : `${charCount}`}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

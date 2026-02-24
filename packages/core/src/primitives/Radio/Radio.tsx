import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Radio.module.css'

// ─── Radio (individual) ───────────────────────────────────────────────────────

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, id, className, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const descId = `${inputId}-desc`

    return (
      <div className={cn(styles.radioWrapper, className)}>
        <div className={styles.row}>
          <div className={styles.inputWrapper}>
            <input
              ref={ref}
              type="radio"
              id={inputId}
              className={styles.input}
              aria-describedby={description ? descId : undefined}
              {...props}
            />
            <span className={styles.indicator} aria-hidden="true" />
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
      </div>
    )
  }
)
Radio.displayName = 'Radio'

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  options: RadioOption[]
  className?: string
}

export const RadioGroup = ({ name, label, value, onChange, options, className }: RadioGroupProps) => {
  const groupId = React.useId()

  return (
    <fieldset className={cn(styles.group, className)} aria-labelledby={label ? `${groupId}-label` : undefined}>
      {label && (
        <legend id={`${groupId}-label`} className={styles.groupLabel}>
          {label}
        </legend>
      )}
      <div className={styles.options}>
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`
          const descId = `${optId}-desc`
          return (
            <div key={opt.value} className={cn(styles.radioWrapper, opt.disabled && styles.disabledWrapper)}>
              <div className={styles.row}>
                <div className={styles.inputWrapper}>
                  <input
                    type="radio"
                    id={optId}
                    name={name}
                    value={opt.value}
                    checked={value === opt.value}
                    disabled={opt.disabled}
                    onChange={() => { if (!opt.disabled) onChange?.(opt.value) }}
                    className={styles.input}
                    aria-describedby={opt.description ? descId : undefined}
                  />
                  <span className={styles.indicator} aria-hidden="true" />
                </div>
                <div className={styles.labelGroup}>
                  <label htmlFor={optId} className={styles.label}>
                    {opt.label}
                  </label>
                  {opt.description && (
                    <span id={descId} className={styles.description}>
                      {opt.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
RadioGroup.displayName = 'RadioGroup'

import React from 'react'
import { cn } from '../../utils/cn'
import styles from './Toggle.module.css'

export interface ToggleProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
  className?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ label, checked, onChange, disabled = false, size = 'md', id, className }, ref) => {
    const generatedId = React.useId()
    const buttonId = id ?? generatedId
    const labelId = `${buttonId}-label`

    return (
      <div className={cn(styles.wrapper, className)}>
        <button
          ref={ref}
          id={buttonId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : 'Toggle'}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(styles.toggle, styles[size], checked && styles.checked, disabled && styles.disabled)}
        >
          <span className={styles.thumb} />
        </button>
        {label && (
          <label id={labelId} className={cn(styles.label, disabled && styles.labelDisabled)}>
            {label}
          </label>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

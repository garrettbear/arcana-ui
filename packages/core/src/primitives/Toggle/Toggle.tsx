import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Toggle.module.css';

export interface ToggleProps {
  /** Label text displayed next to the toggle */
  label?: string;
  /** Whether the toggle is in the on state */
  checked: boolean;
  /** Callback fired when the toggle state changes */
  onChange: (checked: boolean) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Size of the toggle */
  size?: 'sm' | 'md' | 'lg';
  /** HTML id attribute */
  id?: string;
  /** Additional CSS class name */
  className?: string;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ label, checked, onChange, disabled = false, size = 'md', id, className }, ref) => {
    const generatedId = React.useId();
    const buttonId = id ?? generatedId;
    const labelId = `${buttonId}-label`;

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
          className={cn(
            styles.toggle,
            styles[size],
            checked && styles.checked,
            disabled && styles.disabled,
          )}
        >
          <span className={styles.thumb} />
        </button>
        {label && (
          <label id={labelId} className={cn(styles.label, disabled && styles.labelDisabled)}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';

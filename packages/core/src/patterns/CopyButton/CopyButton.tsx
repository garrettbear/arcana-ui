import React, { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './CopyButton.module.css';

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Text to copy to clipboard */
  value: string;
  /** Button label */
  label?: string;
  /** Label shown after copying */
  copiedLabel?: string;
  /** How long "Copied!" stays visible (ms) */
  copiedDuration?: number;
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'icon';
  /** Size */
  size?: 'sm' | 'md';
  /** Additional CSS class */
  className?: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label = 'Copy',
      copiedLabel = 'Copied!',
      copiedDuration = 2000,
      variant = 'default',
      size = 'sm',
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), copiedDuration);
    }, [value, copiedDuration]);

    const iconOnly = variant === 'icon';

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.copyButton,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          className,
        )}
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : `Copy: ${value.slice(0, 50)}`}
        {...props}
      >
        {copied ? (
          <>
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {!iconOnly && <span>{copiedLabel}</span>}
          </>
        ) : (
          <>
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {!iconOnly && <span>{label}</span>}
          </>
        )}
        <span className={styles.srOnly} aria-live="polite">
          {copied ? 'Copied to clipboard' : ''}
        </span>
      </button>
    );
  },
);
CopyButton.displayName = 'CopyButton';

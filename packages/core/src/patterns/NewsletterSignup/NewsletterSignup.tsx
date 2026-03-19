import React, { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './NewsletterSignup.module.css';

export interface NewsletterSignupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Section title */
  title?: string;
  /** Description text */
  description?: string;
  /** Input placeholder */
  placeholder?: string;
  /** Button label */
  buttonText?: string;
  /** Submit handler — receives validated email */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Layout variant */
  variant?: 'inline' | 'card' | 'banner';
  /** Message after successful submit */
  successMessage?: string;
  /** Additional CSS class */
  className?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterSignup = React.forwardRef<HTMLDivElement, NewsletterSignupProps>(
  (
    {
      title = 'Subscribe to our newsletter',
      description,
      placeholder = 'Enter your email',
      buttonText = 'Subscribe',
      onSubmit,
      variant = 'inline',
      successMessage = 'Thanks for subscribing!',
      className,
      ...props
    },
    ref,
  ) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!EMAIL_RE.test(email)) {
          setError('Please enter a valid email address');
          return;
        }
        setLoading(true);
        try {
          await onSubmit?.(email);
          setSuccess(true);
        } finally {
          setLoading(false);
        }
      },
      [email, onSubmit],
    );

    if (success) {
      return (
        <div
          ref={ref}
          className={cn(styles.newsletter, styles[`variant-${variant}`], className)}
          {...props}
        >
          <p className={styles.success} aria-live="polite">
            {successMessage}
          </p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.newsletter, styles[`variant-${variant}`], className)}
        {...props}
      >
        {(variant !== 'inline' || title) && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        <form className={styles.form} onSubmit={handleSubmit} aria-label="Newsletter signup">
          <div className={styles.inputGroup}>
            <input
              type="email"
              className={styles.input}
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              aria-invalid={error ? true : undefined}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? '...' : buttonText}
            </button>
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  },
);
NewsletterSignup.displayName = 'NewsletterSignup';

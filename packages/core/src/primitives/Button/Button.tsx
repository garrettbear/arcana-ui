import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Button.module.css';

/** All available button size options */
export type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon'
  | 'icon-lg'
  | 'icon-xl';

/** Button shape options */
export type ButtonShape = 'default' | 'circle' | 'pill';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  /** Size of the button */
  size?: ButtonSize;
  /** Shape of the button */
  shape?: ButtonShape;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon element displayed before the label */
  icon?: React.ReactNode;
  /** Icon element displayed after the label */
  iconRight?: React.ReactNode;
  /** Whether the button stretches to fill its container */
  fullWidth?: boolean;
  /** @deprecated Use size="icon" instead. Render as an icon-only button (square shape, requires aria-label) */
  iconOnly?: boolean;
}

const SIZE_CLASS_MAP: Record<ButtonSize, string> = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  'icon-xs': styles.iconXs,
  'icon-sm': styles.iconSm,
  icon: styles.icon,
  'icon-lg': styles.iconLg,
  'icon-xl': styles.iconXl,
};

const SHAPE_CLASS_MAP: Record<ButtonShape, string | undefined> = {
  default: undefined,
  circle: styles.circle,
  pill: styles.pill,
};

const Spinner = () => (
  <svg
    className={styles.spinner}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className={styles.spinnerTrack}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className={styles.spinnerArc}
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      shape = 'default',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      iconOnly = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const isIconSize = size.startsWith('icon');

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          styles.button,
          styles[variant],
          SIZE_CLASS_MAP[size],
          SHAPE_CLASS_MAP[shape],
          fullWidth && styles.fullWidth,
          iconOnly && styles.iconOnly,
          loading && styles.loading,
          className,
        )}
        {...props}
      >
        {loading && <Spinner />}
        {!loading && icon && (
          <span className={styles.iconLeading} aria-hidden="true">
            {icon}
          </span>
        )}
        {children && !isIconSize && <span className={styles.label}>{children}</span>}
        {iconRight && (
          <span className={styles.iconTrailing} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

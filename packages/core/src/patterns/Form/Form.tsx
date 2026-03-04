import React, { createContext, useContext } from 'react';
import { cn } from '../../utils/cn';
import styles from './Form.module.css';

// ─── FormField Context ────────────────────────────────────────────────────────

interface FormFieldContextValue {
  isRequired: boolean;
  isInvalid: boolean;
  fieldId: string;
}

const FormFieldContext = createContext<FormFieldContextValue>({
  isRequired: false,
  isInvalid: false,
  fieldId: '',
});

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Form content (FormField elements) */
  children?: React.ReactNode;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <form ref={ref} className={cn(styles.form, className)} noValidate {...props}>
        {children}
      </form>
    );
  },
);
Form.displayName = 'Form';

// ─── FormField ────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  /** Whether the field is required */
  isRequired?: boolean;
  /** Whether the field has a validation error */
  isInvalid?: boolean;
  /** Field content (FormLabel, input, FormHelperText, FormErrorMessage) */
  children?: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ isRequired = false, isInvalid = false, children, className }, ref) => {
    const fieldId = React.useId();
    return (
      <FormFieldContext.Provider value={{ isRequired, isInvalid, fieldId }}>
        <div ref={ref} className={cn(styles.field, className)}>
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  },
);
FormField.displayName = 'FormField';

// ─── FormLabel ────────────────────────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text content */
  children?: React.ReactNode;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { isRequired } = useContext(FormFieldContext);
    return (
      <label ref={ref} className={cn(styles.label, className)} {...props}>
        {children}
        {isRequired && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
    );
  },
);
FormLabel.displayName = 'FormLabel';

// ─── FormHelperText ───────────────────────────────────────────────────────────

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Helper text content — hidden when the field is invalid */
  children?: React.ReactNode;
}

export const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ children, className, ...props }, ref) => {
    const { isInvalid } = useContext(FormFieldContext);
    if (isInvalid) return null;
    return (
      <p ref={ref} className={cn(styles.helperText, className)} {...props}>
        {children}
      </p>
    );
  },
);
FormHelperText.displayName = 'FormHelperText';

// ─── FormErrorMessage ─────────────────────────────────────────────────────────

export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Error message content — only visible when the field is invalid */
  children?: React.ReactNode;
}

export const FormErrorMessage = React.forwardRef<HTMLParagraphElement, FormErrorMessageProps>(
  ({ children, className, ...props }, ref) => {
    const { isInvalid } = useContext(FormFieldContext);
    if (!isInvalid) return null;
    return (
      <p ref={ref} role="alert" className={cn(styles.errorMessage, className)} {...props}>
        {children}
      </p>
    );
  },
);
FormErrorMessage.displayName = 'FormErrorMessage';

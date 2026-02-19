import React, { createContext, useContext } from 'react'
import { cn } from '../../utils/cn'
import styles from './Form.module.css'

// ─── FormField Context ────────────────────────────────────────────────────────

interface FormFieldContextValue {
  isRequired: boolean
  isInvalid: boolean
  fieldId: string
}

const FormFieldContext = createContext<FormFieldContextValue>({
  isRequired: false,
  isInvalid: false,
  fieldId: '',
})

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <form ref={ref} className={cn(styles.form, className)} noValidate {...props}>
        {children}
      </form>
    )
  }
)
Form.displayName = 'Form'

// ─── FormField ────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  isRequired?: boolean
  isInvalid?: boolean
  children?: React.ReactNode
  className?: string
}

export const FormField = ({ isRequired = false, isInvalid = false, children, className }: FormFieldProps) => {
  const fieldId = React.useId()
  return (
    <FormFieldContext.Provider value={{ isRequired, isInvalid, fieldId }}>
      <div className={cn(styles.field, className)}>{children}</div>
    </FormFieldContext.Provider>
  )
}
FormField.displayName = 'FormField'

// ─── FormLabel ────────────────────────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode
}

export const FormLabel = ({ children, className, ...props }: FormLabelProps) => {
  const { isRequired } = useContext(FormFieldContext)
  return (
    <label className={cn(styles.label, className)} {...props}>
      {children}
      {isRequired && (
        <span className={styles.required} aria-hidden="true">
          {' '}*
        </span>
      )}
    </label>
  )
}
FormLabel.displayName = 'FormLabel'

// ─── FormHelperText ───────────────────────────────────────────────────────────

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormHelperText = ({ children, className, ...props }: FormHelperTextProps) => {
  const { isInvalid } = useContext(FormFieldContext)
  if (isInvalid) return null
  return (
    <p className={cn(styles.helperText, className)} {...props}>
      {children}
    </p>
  )
}
FormHelperText.displayName = 'FormHelperText'

// ─── FormErrorMessage ─────────────────────────────────────────────────────────

export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormErrorMessage = ({ children, className, ...props }: FormErrorMessageProps) => {
  const { isInvalid } = useContext(FormFieldContext)
  if (!isInvalid) return null
  return (
    <p role="alert" className={cn(styles.errorMessage, className)} {...props}>
      {children}
    </p>
  )
}
FormErrorMessage.displayName = 'FormErrorMessage'

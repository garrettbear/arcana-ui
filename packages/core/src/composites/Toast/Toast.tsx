import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import styles from './Toast.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastItem extends ToastOptions {
  id: string
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Individual Toast ─────────────────────────────────────────────────────────

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
}

interface SingleToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

function SingleToast({ toast, onDismiss }: SingleToastProps) {
  const [visible, setVisible] = useState(false)
  const [removing, setRemoving] = useState(false)
  const duration = toast.duration ?? 5000

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = requestAnimationFrame(() => setVisible(true))
    // Auto-dismiss
    const exitTimer = setTimeout(() => {
      setRemoving(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, duration)

    return () => {
      cancelAnimationFrame(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [toast.id, duration, onDismiss])

  const handleDismiss = () => {
    setRemoving(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const icon = variantIcons[toast.variant ?? 'default']

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        styles.toast,
        toast.variant && toast.variant !== 'default' && styles[toast.variant],
        visible && !removing ? styles.visible : styles.hidden
      )}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.content}>
        <p className={styles.title}>{toast.title}</p>
        {toast.description && <p className={styles.description}>{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              toast.action!.onClick()
              handleDismiss()
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

// ─── Toast Portal ─────────────────────────────────────────────────────────────

interface ToastPortalProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

function ToastPortal({ toasts, onDismiss }: ToastPortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <div className={styles.portal} aria-label="Notifications">
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++counterRef.current}`
    setToasts((prev) => [...prev, { ...options, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPortal toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
ToastProvider.displayName = 'ToastProvider'

// ─── useToast ─────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

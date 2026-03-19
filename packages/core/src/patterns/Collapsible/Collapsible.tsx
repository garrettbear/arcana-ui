import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Collapsible.module.css';

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Clickable trigger element */
  trigger: React.ReactNode;
  /** Collapsible content */
  children: React.ReactNode;
  /** Animate height transition */
  animateHeight?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      trigger,
      children,
      animateHeight = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerId = React.useId();
    const contentId = `${triggerId}-content`;

    const toggle = useCallback(() => {
      const next = !isOpen;
      if (controlledOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    }, [isOpen, controlledOpen, onOpenChange]);

    // Animate height
    useEffect(() => {
      if (!animateHeight || !contentRef.current) return;
      const el = contentRef.current;
      if (isOpen) {
        el.style.height = `${el.scrollHeight}px`;
        const onEnd = () => {
          el.style.height = 'auto';
        };
        el.addEventListener('transitionend', onEnd, { once: true });
      } else {
        el.style.height = `${el.scrollHeight}px`;
        requestAnimationFrame(() => {
          el.style.height = '0';
        });
      }
    }, [isOpen, animateHeight]);

    return (
      <div ref={ref} className={cn(styles.collapsible, className)} {...props}>
        <div
          id={triggerId}
          className={styles.trigger}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
        >
          {trigger}
        </div>
        <div
          ref={contentRef}
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className={cn(styles.content, isOpen && styles.open, animateHeight && styles.animated)}
        >
          {children}
        </div>
      </div>
    );
  },
);
Collapsible.displayName = 'Collapsible';

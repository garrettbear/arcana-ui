import React from 'react';
import { cn } from '../../utils/cn';
import styles from './ScrollArea.module.css';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum height constraint */
  maxHeight?: string;
  /** Scroll direction */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Scrollbar visibility */
  showScrollbar?: 'auto' | 'always' | 'hover';
  /** Scrollable content */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      maxHeight,
      orientation = 'vertical',
      showScrollbar = 'auto',
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        styles.scrollArea,
        styles[`orientation-${orientation}`],
        styles[`scrollbar-${showScrollbar}`],
        className,
      )}
      style={{ ...style, maxHeight }}
      {...props}
    >
      {children}
    </div>
  ),
);
ScrollArea.displayName = 'ScrollArea';

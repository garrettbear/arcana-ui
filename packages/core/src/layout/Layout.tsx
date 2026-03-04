import React from 'react';
import { cn } from '../utils/cn';
import styles from './Layout.module.css';

// ─── Stack ────────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing between children — number maps to spacing token, string is raw CSS value */
  gap?: number | string;
  /** Cross-axis alignment of children */
  align?: React.CSSProperties['alignItems'];
  /** Main-axis alignment of children */
  justify?: React.CSSProperties['justifyContent'];
  /** Whether children should wrap to the next line */
  wrap?: boolean;
  /** Stack content */
  children?: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, align, justify, wrap, children, className, style, ...props }, ref) => {
    const gapValue = typeof gap === 'number' ? `var(--spacing-${gap})` : gap;
    return (
      <div
        ref={ref}
        className={cn(styles.stack, className)}
        style={{
          gap: gapValue,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Stack.displayName = 'Stack';

// ─── HStack ───────────────────────────────────────────────────────────────────

export interface HStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing between children — number maps to spacing token, string is raw CSS value */
  gap?: number | string;
  /** Cross-axis alignment of children */
  align?: React.CSSProperties['alignItems'];
  /** Main-axis alignment of children */
  justify?: React.CSSProperties['justifyContent'];
  /** Whether children should wrap to the next line */
  wrap?: boolean;
  /** Horizontal stack content */
  children?: React.ReactNode;
}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ gap = 4, align = 'center', justify, wrap, children, className, style, ...props }, ref) => {
    const gapValue = typeof gap === 'number' ? `var(--spacing-${gap})` : gap;
    return (
      <div
        ref={ref}
        className={cn(styles.hstack, className)}
        style={{
          gap: gapValue,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
HStack.displayName = 'HStack';

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns or CSS grid-template-columns value */
  columns?: number | string;
  /** Gap between grid items — number maps to spacing token, string is raw CSS value */
  gap?: number | string;
  /** Vertical gap between grid rows — number maps to spacing token */
  rowGap?: number | string;
  /** Horizontal gap between grid columns — number maps to spacing token */
  columnGap?: number | string;
  /** Grid content */
  children?: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 2, gap, rowGap, columnGap, children, className, style, ...props }, ref) => {
    const colValue = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
    const gapValue =
      gap !== undefined ? (typeof gap === 'number' ? `var(--spacing-${gap})` : gap) : undefined;
    const rowGapValue =
      rowGap !== undefined
        ? typeof rowGap === 'number'
          ? `var(--spacing-${rowGap})`
          : rowGap
        : undefined;
    const colGapValue =
      columnGap !== undefined
        ? typeof columnGap === 'number'
          ? `var(--spacing-${columnGap})`
          : columnGap
        : undefined;

    return (
      <div
        ref={ref}
        className={cn(styles.grid, className)}
        style={{
          gridTemplateColumns: colValue,
          gap: gapValue,
          rowGap: rowGapValue,
          columnGap: colGapValue,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = 'Grid';

// ─── Container ────────────────────────────────────────────────────────────────

const containerSizes: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the container */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Container content */
  children?: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.container, className)}
        style={{ maxWidth: containerSizes[size], ...style }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Container.displayName = 'Container';

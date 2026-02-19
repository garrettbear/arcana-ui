import React from 'react'
import { cn } from '../utils/cn'
import styles from './Layout.module.css'

// ─── Stack ────────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  wrap?: boolean
  children?: React.ReactNode
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, align, justify, wrap, children, className, style, ...props }, ref) => {
    const gapValue = typeof gap === 'number' ? `var(--arcana-spacing-${gap})` : gap
    return (
      <div
        ref={ref}
        className={cn(styles.stack, className)}
        style={{ gap: gapValue, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Stack.displayName = 'Stack'

// ─── HStack ───────────────────────────────────────────────────────────────────

export interface HStackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  wrap?: boolean
  children?: React.ReactNode
}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ gap = 4, align = 'center', justify, wrap, children, className, style, ...props }, ref) => {
    const gapValue = typeof gap === 'number' ? `var(--arcana-spacing-${gap})` : gap
    return (
      <div
        ref={ref}
        className={cn(styles.hstack, className)}
        style={{ gap: gapValue, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
HStack.displayName = 'HStack'

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string
  gap?: number | string
  rowGap?: number | string
  columnGap?: number | string
  children?: React.ReactNode
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 2, gap, rowGap, columnGap, children, className, style, ...props }, ref) => {
    const colValue = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns
    const gapValue = gap !== undefined
      ? (typeof gap === 'number' ? `var(--arcana-spacing-${gap})` : gap)
      : undefined
    const rowGapValue = rowGap !== undefined
      ? (typeof rowGap === 'number' ? `var(--arcana-spacing-${rowGap})` : rowGap)
      : undefined
    const colGapValue = columnGap !== undefined
      ? (typeof columnGap === 'number' ? `var(--arcana-spacing-${columnGap})` : columnGap)
      : undefined

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
    )
  }
)
Grid.displayName = 'Grid'

// ─── Container ────────────────────────────────────────────────────────────────

const containerSizes: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  children?: React.ReactNode
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
    )
  }
)
Container.displayName = 'Container'

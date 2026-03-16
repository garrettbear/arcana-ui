import React from 'react';
import { cn } from '../utils/cn';
import styles from './Layout.module.css';

// ─── Shared Helpers ──────────────────────────────────────────────────────────

type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const gapTokens: Record<GapSize, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

function resolveGap(gap: GapSize | number | string | undefined): string | undefined {
  if (gap === undefined) return undefined;
  if (typeof gap === 'number') return `var(--spacing-${gap})`;
  if (gap in gapTokens) return gapTokens[gap as GapSize];
  return gap;
}

// ─── Stack ────────────────────────────────────────────────────────────────────

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Direction of the stack layout */
  direction?: 'vertical' | 'horizontal';
  /** Spacing between children — semantic name, number (maps to token), or raw CSS */
  gap?: GapSize | number | string;
  /** Cross-axis alignment of children */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis alignment of children */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Whether children should wrap to the next line */
  wrap?: boolean;
  /** HTML element to render as */
  as?: React.ElementType;
  /** Stack content */
  children?: React.ReactNode;
}

const justifyMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

const alignMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      direction = 'vertical',
      gap = 'md',
      align,
      justify,
      wrap,
      as: Component = 'div',
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(styles.stack, direction === 'horizontal' && styles.stackRow, className)}
        style={{
          gap: resolveGap(gap),
          alignItems: align ? alignMap[align] : undefined,
          justifyContent: justify ? justifyMap[justify] : undefined,
          flexWrap: wrap ? 'wrap' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Stack.displayName = 'Stack';

// ─── HStack ──────────────────────────────────────────────────────────────────

export interface HStackProps extends React.HTMLAttributes<HTMLElement> {
  /** Spacing between children — semantic name, number (maps to token), or raw CSS */
  gap?: GapSize | number | string;
  /** Cross-axis alignment of children */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis alignment of children */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Whether children should wrap to the next line */
  wrap?: boolean;
  /** HTML element to render as */
  as?: React.ElementType;
  /** Horizontal stack content */
  children?: React.ReactNode;
}

export const HStack = React.forwardRef<HTMLElement, HStackProps>(
  (
    {
      gap = 'md',
      align = 'center',
      justify,
      wrap,
      as: Component = 'div',
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(styles.hstack, className)}
        style={{
          gap: resolveGap(gap),
          alignItems: align ? alignMap[align] : undefined,
          justifyContent: justify ? justifyMap[justify] : undefined,
          flexWrap: wrap ? 'wrap' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
HStack.displayName = 'HStack';

// ─── Container ───────────────────────────────────────────────────────────────

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Maximum width of the container */
  size?: ContainerSize;
  /** When true, sets max-width to optimal reading width (65ch). Overrides size. */
  prose?: boolean;
  /** Horizontal edge padding. Responsive by default. */
  padding?: ContainerPadding;
  /** Centers the container with auto margins */
  center?: boolean;
  /** HTML element to render as */
  as?: React.ElementType;
  /** Container content */
  children?: React.ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: styles.containerSm,
  md: styles.containerMd,
  lg: styles.containerLg,
  xl: styles.containerXl,
  '2xl': styles.container2xl,
  full: styles.containerFull,
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  (
    {
      size = 'xl',
      prose = false,
      padding = 'md',
      center = true,
      as: Component = 'div',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClass = prose ? styles.containerProse : sizeClasses[size];

    return (
      <Component
        ref={ref}
        className={cn(
          styles.container,
          sizeClass,
          paddingClasses[padding],
          !center && styles.noCenter,
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Container.displayName = 'Container';

// ─── Grid ────────────────────────────────────────────────────────────────────

interface ResponsiveColumns {
  /** Columns at tablet (640px+) */
  sm?: number;
  /** Columns at desktop (1024px+) */
  md?: number;
  /** Columns at wide (1024px+) */
  lg?: number;
  /** Columns at ultra wide (1280px+) */
  xl?: number;
}

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of columns or responsive column object. Default: auto-collapses (1 mobile, 12 desktop). */
  columns?: number | ResponsiveColumns;
  /** Gap between grid items — semantic name, number, or raw CSS */
  gap?: GapSize | number | string;
  /** Vertical gap between grid rows */
  rowGap?: GapSize | number | string;
  /** Horizontal gap between grid columns */
  colGap?: GapSize | number | string;
  /** Vertical alignment of grid items */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Horizontal alignment of grid items */
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'between';
  /** HTML element to render as */
  as?: React.ElementType;
  /** Grid content */
  children?: React.ReactNode;
}

const gridAlignMap: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
};

const gridJustifyMap: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
  between: 'space-between',
};

export const Grid = React.forwardRef<HTMLElement, GridProps>(
  (
    {
      columns = 12,
      gap = 'md',
      rowGap,
      colGap,
      align,
      justify,
      as: Component = 'div',
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    let gridStyle: React.CSSProperties;

    if (typeof columns === 'number') {
      // Fixed column count — auto-collapse to 1 on mobile via CSS custom property
      gridStyle = {
        gridTemplateColumns: `repeat(var(--grid-cols, ${columns}), minmax(0, 1fr))`,
        gap: resolveGap(gap),
        rowGap: resolveGap(rowGap),
        columnGap: resolveGap(colGap),
        alignItems: align ? gridAlignMap[align] : undefined,
        justifyContent: justify ? gridJustifyMap[justify] : undefined,
        ...style,
      };
    } else {
      // Responsive columns — use CSS custom property that changes per breakpoint
      const { sm = 1, md, lg, xl } = columns;
      // Build a CSS custom property-based approach.
      // Default (mobile) = 1 column. Each breakpoint is handled via --grid-cols.
      // We set inline style for mobile default + CSS will override at breakpoints.
      gridStyle = {
        gridTemplateColumns: 'repeat(var(--grid-cols, 1), minmax(0, 1fr))',
        '--grid-cols-sm': String(sm),
        '--grid-cols-md': String(md ?? sm),
        '--grid-cols-lg': String(lg ?? md ?? sm),
        '--grid-cols-xl': String(xl ?? lg ?? md ?? sm),
        gap: resolveGap(gap),
        rowGap: resolveGap(rowGap),
        columnGap: resolveGap(colGap),
        alignItems: align ? gridAlignMap[align] : undefined,
        justifyContent: justify ? gridJustifyMap[justify] : undefined,
        ...style,
      } as React.CSSProperties;
    }

    return (
      <Component
        ref={ref}
        className={cn(
          styles.grid,
          typeof columns === 'object' && styles.gridResponsive,
          typeof columns === 'number' && styles.gridAutoCollapse,
          className,
        )}
        style={gridStyle}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Grid.displayName = 'Grid';

// ─── Grid.Column ─────────────────────────────────────────────────────────────

interface ResponsiveSpan {
  /** Span at mobile (default) */
  default?: number;
  /** Span at tablet (640px+) */
  sm?: number;
  /** Span at desktop (1024px+) */
  lg?: number;
  /** Span at wide (1280px+) */
  xl?: number;
}

export interface GridColumnProps extends React.HTMLAttributes<HTMLElement> {
  /** Number of columns to span, or responsive span object */
  span?: number | ResponsiveSpan;
  /** Grid column start position */
  start?: number;
  /** HTML element to render as */
  as?: React.ElementType;
  /** Column content */
  children?: React.ReactNode;
}

export const GridColumn = React.forwardRef<HTMLElement, GridColumnProps>(
  ({ span = 12, start, as: Component = 'div', children, className, style, ...props }, ref) => {
    let colStyle: React.CSSProperties;

    if (typeof span === 'number') {
      colStyle = {
        gridColumn: `span ${span}`,
        gridColumnStart: start,
        ...style,
      };
    } else {
      // Responsive spans via CSS custom properties
      const { default: defaultSpan = 12, sm, lg, xl } = span;
      colStyle = {
        gridColumn: `span var(--col-span, ${defaultSpan})`,
        gridColumnStart: start,
        '--col-span-sm': String(sm ?? defaultSpan),
        '--col-span-lg': String(lg ?? sm ?? defaultSpan),
        '--col-span-xl': String(xl ?? lg ?? sm ?? defaultSpan),
        ...style,
      } as React.CSSProperties;
    }

    return (
      <Component
        ref={ref}
        className={cn(
          styles.column,
          typeof span === 'object' && styles.columnResponsive,
          className,
        )}
        style={colStyle}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
GridColumn.displayName = 'GridColumn';

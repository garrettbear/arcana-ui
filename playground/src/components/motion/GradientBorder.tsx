import { type HTMLAttributes, forwardRef } from 'react';
import styles from './motion.module.css';

export interface GradientBorderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Thickness of the painted border in CSS length units. Default 1px.
   * Larger values (2-3px) read as a heavier frame and pair well with
   * dense feature tiles; keep at 1px for cards that sit in a grid.
   */
  borderWidth?: string;
  /**
   * Render as a different element. Default div. Use section / article
   * when the wrapped content is semantically a landmark.
   */
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Wrapper that paints a conic-gradient border on its edges, using the
 * theme's accent and accent-bright tokens. The gradient is invisible
 * at rest and rotates into view on hover / focus-within so the effect
 * is a reveal, not ambient noise. Honors `prefers-reduced-motion` by
 * opting out of the rotation while still showing the border.
 *
 * The wrapper itself sets no border-radius: inherit from the caller by
 * giving this element the same `border-radius` you'd put on a Card,
 * since both the mask and the conic-gradient follow `inherit`.
 */
export const GradientBorder = forwardRef<HTMLDivElement, GradientBorderProps>(
  function GradientBorder(props, ref) {
    const { borderWidth, as: Tag = 'div', className, style, children, ...rest } = props;

    const mergedStyle = borderWidth
      ? ({ ...style, '--gradient-border-width': borderWidth } as React.CSSProperties)
      : style;

    const TagName = Tag as 'div';
    return (
      <TagName
        ref={ref}
        className={[styles.gradientBorder, className].filter(Boolean).join(' ')}
        style={mergedStyle}
        {...rest}
      >
        {children}
      </TagName>
    );
  },
);

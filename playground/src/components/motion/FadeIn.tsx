import { type HTMLAttributes, forwardRef } from 'react';
import { useInView } from '../../hooks/useInView';
import styles from './motion.module.css';

export interface FadeInProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Delay before the fade begins, in milliseconds. 0 = runs as soon as
   * the element intersects the viewport. Use to stagger elements by
   * hand when a single Stagger wrapper isn't enough.
   */
  delay?: number;
  /**
   * How far the element translates up from its resting position as it
   * fades. Default 24px. Pass 0 for opacity-only fades, a larger value
   * for hero headlines.
   */
  translateY?: number;
  /**
   * Render as a different element. Defaults to div. Use span for inline
   * content so the fade doesn't trigger block-level reflow.
   */
  as?: 'div' | 'span' | 'section';
}

/**
 * Opacity 0 → 1 + translateY fade that fires once the element is in
 * view. Duration and easing come from var(--duration-slow) and
 * var(--ease-out). Honors `prefers-reduced-motion` by collapsing to an
 * instant appearance (0ms transition).
 */
export const FadeIn = forwardRef<HTMLElement, FadeInProps>(function FadeIn(props, ref) {
  const {
    delay = 0,
    translateY = 24,
    as: Tag = 'div',
    className,
    style,
    children,
    ...rest
  } = props;
  const [inViewRef, inView] = useInView<HTMLElement>();

  // Merge the internal observer ref with the forwarded ref.
  const mergedRef = (node: HTMLElement | null) => {
    (inViewRef as { current: HTMLElement | null }).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLElement | null }).current = node;
  };

  const mergedStyle = {
    ...style,
    '--fade-delay': `${delay}ms`,
    '--fade-translate': `${translateY}px`,
  } as React.CSSProperties;

  const TagName = Tag as 'div';
  return (
    <TagName
      ref={mergedRef as React.Ref<HTMLDivElement>}
      className={[styles.fadeIn, inView ? styles.fadeInVisible : '', className]
        .filter(Boolean)
        .join(' ')}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </TagName>
  );
});

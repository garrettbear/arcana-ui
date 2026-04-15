import { Children, type HTMLAttributes, cloneElement, forwardRef, isValidElement } from 'react';
import { FadeIn, type FadeInProps } from './FadeIn';

export interface StaggerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Delay between each child, in milliseconds. Default 80ms. Larger
   * values read as deliberate (numbered steps, hero stats). Smaller
   * values read as dense/fast (logo cloud, theme gallery).
   */
  step?: number;
  /**
   * Starting delay applied to the first child. Useful when the
   * stagger itself should wait for another animation to finish.
   */
  baseDelay?: number;
  /**
   * Optional translateY override forwarded to every child FadeIn.
   * Default 24px (FadeIn's own default) when omitted.
   */
  translateY?: number;
  /**
   * Render as a different element. Default div.
   */
  as?: 'div' | 'ul' | 'ol' | 'section';
}

/**
 * Wraps each direct child in a FadeIn with `delay = baseDelay + i * step`.
 * Children that are already FadeIn instances are cloned with the
 * computed delay so authors can mix bare markup and explicit FadeIns
 * in the same list. Non-element children (strings, numbers, fragments)
 * are rendered verbatim without a wrapper.
 */
export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(function Stagger(props, ref) {
  const {
    step = 80,
    baseDelay = 0,
    translateY,
    as: Tag = 'div',
    children,
    className,
    ...rest
  } = props;

  const wrapped = Children.map(children, (child, i) => {
    const delay = baseDelay + i * step;
    if (!isValidElement(child)) return child;
    if (child.type === FadeIn) {
      const existing = child.props as FadeInProps;
      return cloneElement(child, {
        delay: existing.delay ?? delay,
        translateY: existing.translateY ?? translateY,
      });
    }
    return (
      <FadeIn
        key={(child as { key?: string | number }).key ?? i}
        delay={delay}
        translateY={translateY}
      >
        {child}
      </FadeIn>
    );
  });

  const TagName = Tag as 'div';
  return (
    <TagName ref={ref} className={className} {...rest}>
      {wrapped}
    </TagName>
  );
});

import { type HTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';

export interface CountUpProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Target value. The animation always starts at 0 and eases up to
   * this number. Pass the same integer you would have hard-coded into
   * the span; the component handles formatting.
   */
  to: number;
  /**
   * Total animation duration in milliseconds. Default 1200ms to match
   * the deliberate pacing of the landing stats row.
   */
  duration?: number;
  /**
   * Suffix appended after the number once it finishes animating. Use
   * for '+', 'k', '%'. Rendered inside its own span so authors can
   * target it with CSS if they want it to fade in separately.
   */
  suffix?: string;
  /**
   * When true, formats the rendered number with locale-aware
   * thousands separators (e.g. 2600 -> "2,600"). Default true.
   */
  formatThousands?: boolean;
  /**
   * Starting delay in milliseconds after the element enters view.
   * Pair with Stagger's `step` when several CountUps appear together.
   */
  delay?: number;
}

/**
 * Animates a number from 0 up to `to` the first time the element
 * scrolls into view. Uses requestAnimationFrame + an ease-out cubic so
 * the number decelerates into its final value (a linear ramp reads as
 * a stopwatch, not a reveal). Honors `prefers-reduced-motion` by
 * snapping straight to the final value.
 */
export const CountUp = forwardRef<HTMLSpanElement, CountUpProps>(function CountUp(props, ref) {
  const {
    to,
    duration = 1200,
    suffix,
    formatThousands = true,
    delay = 0,
    className,
    ...rest
  } = props;
  const [inViewRef, inView] = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  const mergedRef = (node: HTMLSpanElement | null) => {
    (inViewRef as { current: HTMLSpanElement | null }).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLSpanElement | null }).current = node;
  };

  useEffect(() => {
    if (!inView) return;

    // Reduced-motion: snap to the end and skip the rAF loop entirely.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(to);
      return;
    }

    let rafId = 0;
    let startTime: number | null = null;
    const timeoutId = window.setTimeout(() => {
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Cubic ease-out: 1 - (1 - t)^3
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(to * eased));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [inView, to, duration, delay]);

  const rendered = formatThousands ? value.toLocaleString('en-US') : String(value);

  return (
    <span ref={mergedRef} className={className} {...rest}>
      {rendered}
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
    </span>
  );
});

import { type RefObject, useEffect, useRef, useState } from 'react';

/**
 * Watches an element and flips to `true` the first time it scrolls into
 * view. Hand-rolled on top of IntersectionObserver so the motion layer
 * on the landing stays dependency-free. Pair with the FadeIn / Stagger
 * primitives in `components/motion/`.
 *
 * Contract:
 *  - Once in view, the hook stays `true` for the rest of the page
 *    lifetime. No "fade back out on scroll" — that pattern reads as
 *    broken, not elegant.
 *  - If IntersectionObserver is absent (very old browsers, JSDOM
 *    without a polyfill) the hook reports `true` on mount so content
 *    is never hidden by a failed animation.
 *  - If the user has `prefers-reduced-motion: reduce` set the hook
 *    also reports `true` immediately; primitives are expected to
 *    collapse their transition to 0ms in that case, so the early-true
 *    keeps them out of a broken in-between state.
 *
 * @param options.threshold  IntersectionObserver threshold (default 0.15).
 * @param options.rootMargin Optional rootMargin string (e.g. "0px 0px -10% 0px").
 * @returns [ref, inView] — spread the ref onto any element.
 */
export function useInView<T extends Element = HTMLElement>(
  options: { threshold?: number; rootMargin?: string } = {},
): [RefObject<T>, boolean] {
  const { threshold = 0.15, rootMargin } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion and environments without IntersectionObserver
    // by reporting "in view" up front. The consuming primitive decides
    // what that means at zero duration.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}

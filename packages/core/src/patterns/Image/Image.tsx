import React, { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Image.module.css';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  /** Image source URL */
  src: string;
  /** Alt text (required for accessibility — use "" for decorative images) */
  alt: string;
  /**
   * Fallback content shown while the image is loading or when it fails to load.
   * When `errorFallback` is also provided, `fallback` is only used during loading.
   */
  fallback?: React.ReactNode;
  /**
   * Content shown specifically when the image fails to load. Takes precedence over
   * `fallback` in the error state. When the image has failed, the underlying
   * `<img>` element is removed from the rendered output so the browser cannot
   * paint a broken-image icon behind the fallback.
   */
  errorFallback?: React.ReactNode;
  /** Aspect ratio constraint */
  aspectRatio?: number | 'square' | 'video' | 'portrait';
  /** How the image fills its container */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Use native lazy loading */
  lazy?: boolean;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional CSS class */
  className?: string;
}

const RATIOS: Record<string, number> = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallback,
      errorFallback,
      aspectRatio,
      objectFit = 'cover',
      lazy = true,
      radius = 'none',
      className,
      style,
      onLoad,
      onError: onErrorProp,
      ...props
    },
    ref,
  ) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    // Reset status when src changes so a previously-errored <Image> recovers
    // after the caller swaps in a different URL.
    React.useEffect(() => {
      setStatus('loading');
    }, [src]);

    const handleLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setStatus('loaded');
        onLoad?.(e);
      },
      [onLoad],
    );

    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setStatus('error');
        onErrorProp?.(e);
      },
      [onErrorProp],
    );

    const ratioValue = aspectRatio
      ? typeof aspectRatio === 'number'
        ? aspectRatio
        : RATIOS[aspectRatio]
      : undefined;

    const wrapperStyle: React.CSSProperties = {
      ...style,
      ...(ratioValue ? { aspectRatio: `${ratioValue}` } : {}),
    };

    const isError = status === 'error';
    const showFallback = status === 'loading' || isError;
    const fallbackContent = isError
      ? (errorFallback ??
        fallback ?? (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ))
      : (fallback ?? <div className={styles.skeleton} />);

    return (
      <div
        className={cn(
          styles.imageWrapper,
          radius !== 'none' && styles[`radius-${radius}`],
          className,
        )}
        style={wrapperStyle}
      >
        {/* On error we unmount the <img> entirely so the browser cannot paint a
            broken-image icon behind the fallback. On load and while loading,
            the <img> is rendered so native decoding + lazy loading still work. */}
        {!isError && (
          // biome-ignore lint/a11y/useAltText: alt is a required prop
          <img
            ref={ref}
            src={src}
            alt={alt}
            loading={lazy ? 'lazy' : undefined}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(styles.img, status === 'loaded' && styles.loaded)}
            style={{ objectFit }}
            {...props}
          />
        )}
        {showFallback && (
          <div
            className={styles.fallback}
            // Hide decorative loading state from assistive tech; surface errors.
            aria-hidden={isError ? undefined : 'true'}
            role={isError ? 'img' : undefined}
            aria-label={isError ? alt || undefined : undefined}
          >
            {fallbackContent}
          </div>
        )}
      </div>
    );
  },
);
Image.displayName = 'Image';

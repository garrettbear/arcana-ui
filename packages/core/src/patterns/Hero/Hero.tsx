import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Hero.module.css';

// ─── Hero ────────────────────────────────────────────────────────────────────

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual layout variant */
  variant?: 'centered' | 'split';
  /** Alignment of text content */
  align?: 'left' | 'center';
  /** Whether to use full viewport height */
  fullHeight?: boolean;
}

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    { variant = 'centered', align = 'center', fullHeight = false, children, className, ...props },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          styles.hero,
          variant === 'split' && styles.split,
          align === 'left' && styles.alignLeft,
          fullHeight && styles.fullHeight,
          className,
        )}
        {...props}
      >
        {children}
      </section>
    );
  },
);
Hero.displayName = 'Hero';

// ─── HeroContent ─────────────────────────────────────────────────────────────

export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroContent.displayName = 'HeroContent';

// ─── HeroTitle ───────────────────────────────────────────────────────────────

export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: 'h1' | 'h2' | 'h3';
}

export const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ as: Tag = 'h1', children, className, ...props }, ref) => {
    return (
      <Tag ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </Tag>
    );
  },
);
HeroTitle.displayName = 'HeroTitle';

// ─── HeroDescription ────────────────────────────────────────────────────────

export interface HeroDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const HeroDescription = React.forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    );
  },
);
HeroDescription.displayName = 'HeroDescription';

// ─── HeroActions ─────────────────────────────────────────────────────────────

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.actions, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroActions.displayName = 'HeroActions';

// ─── HeroMedia ───────────────────────────────────────────────────────────────

export interface HeroMediaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroMedia = React.forwardRef<HTMLDivElement, HeroMediaProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.media, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroMedia.displayName = 'HeroMedia';

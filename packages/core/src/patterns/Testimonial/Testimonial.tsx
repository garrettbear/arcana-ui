import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Testimonial.module.css';

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  /** Layout variant */
  variant?: 'card' | 'inline';
}

export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(
  ({ variant = 'card', children, className, ...props }, ref) => {
    return (
      <figure
        ref={ref}
        className={cn(styles.testimonial, variant === 'inline' && styles.inline, className)}
        {...props}
      >
        {children}
      </figure>
    );
  },
);
Testimonial.displayName = 'Testimonial';

// ─── TestimonialQuote ────────────────────────────────────────────────────────

export interface TestimonialQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}

export const TestimonialQuote = React.forwardRef<HTMLQuoteElement, TestimonialQuoteProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <blockquote ref={ref} className={cn(styles.quote, className)} {...props}>
        {children}
      </blockquote>
    );
  },
);
TestimonialQuote.displayName = 'TestimonialQuote';

// ─── TestimonialAuthor ───────────────────────────────────────────────────────

export interface TestimonialAuthorProps extends React.HTMLAttributes<HTMLElement> {
  /** Author name */
  name: string;
  /** Author title or role */
  title?: string;
  /** Avatar image URL */
  avatar?: string;
}

export const TestimonialAuthor = React.forwardRef<HTMLElement, TestimonialAuthorProps>(
  ({ name, title, avatar, className, ...props }, ref) => {
    return (
      <figcaption ref={ref} className={cn(styles.author, className)} {...props}>
        {avatar && <img src={avatar} alt="" className={styles.avatar} />}
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{name}</span>
          {title && <span className={styles.authorTitle}>{title}</span>}
        </div>
      </figcaption>
    );
  },
);
TestimonialAuthor.displayName = 'TestimonialAuthor';

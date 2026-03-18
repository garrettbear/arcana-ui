import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Footer.module.css';

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether to show a top border */
  border?: boolean;
  /** Layout variant */
  variant?: 'standard' | 'minimal';
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ border = true, variant = 'standard', children, className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          styles.footer,
          border && styles.border,
          variant === 'minimal' && styles.minimal,
          className,
        )}
        {...props}
      >
        <div className={cn(styles.inner, variant === 'minimal' && styles.innerMinimal)}>
          {children}
        </div>
      </footer>
    );
  },
);
Footer.displayName = 'Footer';

// ─── FooterSection ────────────────────────────────────────────────────────────

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading */
  title?: string;
}

export const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
  ({ title, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.section, className)} {...props}>
        {title && <h3 className={styles.sectionTitle}>{title}</h3>}
        {children}
      </div>
    );
  },
);
FooterSection.displayName = 'FooterSection';

// ─── FooterLink ───────────────────────────────────────────────────────────────

export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether this links to an external site */
  external?: boolean;
}

export const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ external = false, children, className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(styles.link, className)}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
        {external && (
          <span className={styles.externalIcon} aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        )}
      </a>
    );
  },
);
FooterLink.displayName = 'FooterLink';

// ─── FooterBottom ─────────────────────────────────────────────────────────────

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FooterBottom = React.forwardRef<HTMLDivElement, FooterBottomProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.bottom, className)} {...props}>
        {children}
      </div>
    );
  },
);
FooterBottom.displayName = 'FooterBottom';

import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Footer.module.css';

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether to show a top border */
  border?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ border = true, children, className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(styles.footer, border && styles.border, className)}
        {...props}
      >
        <div className={styles.inner}>{children}</div>
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

export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <a ref={ref} className={cn(styles.link, className)} {...props}>
        {children}
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

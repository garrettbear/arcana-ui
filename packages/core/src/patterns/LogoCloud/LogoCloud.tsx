import React from 'react';
import { cn } from '../../utils/cn';
import styles from './LogoCloud.module.css';

// ─── LogoItem type ───────────────────────────────────────────────────────────

export interface LogoItem {
  /** Image source URL */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Optional link to company site */
  href?: string;
}

// ─── LogoCloud ───────────────────────────────────────────────────────────────

export interface LogoCloudProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of logo items */
  logos: LogoItem[];
  /** Section title (e.g., "Trusted by") */
  title?: string;
  /** Display variant */
  variant?: 'grid' | 'marquee';
}

export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  ({ logos, title, variant = 'grid', className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn(styles.section, className)} {...props}>
        {title && <p className={styles.title}>{title}</p>}
        {variant === 'grid' && (
          <div className={styles.grid}>
            {logos.map((logo) => (
              <LogoImage key={logo.src} logo={logo} />
            ))}
          </div>
        )}
        {variant === 'marquee' && (
          <div className={styles.marqueeWrapper} aria-hidden="true">
            <div className={styles.marqueeTrack}>
              {logos.map((logo) => (
                <LogoImage key={`a-${logo.src}`} logo={logo} />
              ))}
              {/* Duplicate for seamless loop */}
              {logos.map((logo) => (
                <LogoImage key={`b-${logo.src}`} logo={logo} />
              ))}
            </div>
          </div>
        )}
        {/* Accessible list for marquee variant */}
        {variant === 'marquee' && (
          <ul className={styles.srOnly}>
            {logos.map((logo) => (
              <li key={logo.src}>{logo.alt}</li>
            ))}
          </ul>
        )}
      </section>
    );
  },
);
LogoCloud.displayName = 'LogoCloud';

// ─── Internal LogoImage ──────────────────────────────────────────────────────

function LogoImage({ logo }: { logo: LogoItem }): React.ReactElement {
  const img = <img src={logo.src} alt={logo.alt} className={styles.logo} loading="lazy" />;

  if (logo.href) {
    return (
      <a href={logo.href} className={styles.logoLink} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    );
  }

  return <div className={styles.logoWrap}>{img}</div>;
}

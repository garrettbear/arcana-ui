import React from 'react';
import { cn } from '../../utils/cn';
import styles from './AuthorCard.module.css';

export interface AuthorSocial {
  /** Platform name */
  platform: string;
  /** Link URL */
  url: string;
}

export interface AuthorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Author name */
  name: string;
  /** Role or title */
  role?: string;
  /** Avatar image URL */
  avatar?: string;
  /** Short bio */
  bio?: string;
  /** Social media links */
  social?: AuthorSocial[];
  /** Layout variant */
  variant?: 'inline' | 'card';
  /** Additional CSS class */
  className?: string;
}

export const AuthorCard = React.forwardRef<HTMLDivElement, AuthorCardProps>(
  ({ name, role, avatar, bio, social, variant = 'inline', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(styles.author, styles[`variant-${variant}`], className)}
      {...props}
    >
      {avatar && <img src={avatar} alt={name} className={styles.avatar} loading="lazy" />}
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        {role && <span className={styles.role}>{role}</span>}
        {bio && variant === 'card' && <p className={styles.bio}>{bio}</p>}
        {social && social.length > 0 && variant === 'card' && (
          <div className={styles.social}>
            {social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                className={styles.socialLink}
                aria-label={`${name} on ${s.platform}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  ),
);
AuthorCard.displayName = 'AuthorCard';

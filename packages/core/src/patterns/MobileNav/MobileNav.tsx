import React from 'react';
import { cn } from '../../utils/cn';
import styles from './MobileNav.module.css';

export interface MobileNavItem {
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: string;
  /** Icon element */
  icon: React.ReactNode;
  /** Optional link href (renders as anchor if provided) */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface MobileNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Navigation items (maximum 5) */
  items: MobileNavItem[];
  /** Key of the currently active item */
  activeKey: string;
  /** Callback fired when an item is selected */
  onChange: (key: string) => void;
}

export const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
  ({ items, activeKey, onChange, className, ...props }, ref) => {
    if (items.length > 5) {
      console.warn('MobileNav: Maximum 5 items recommended. Extra items may cause layout issues.');
    }

    return (
      <nav
        ref={ref}
        className={cn(styles.mobileNav, className)}
        aria-label="Mobile navigation"
        {...props}
      >
        <ul className={styles.items}>
          {items.slice(0, 5).map((item) => {
            const isActive = item.key === activeKey;
            const handleClick = () => {
              onChange(item.key);
              item.onClick?.();
            };

            return (
              <li key={item.key} className={styles.item}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={cn(styles.itemButton, isActive && styles.itemActive)}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={handleClick}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemLabel}>{item.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cn(styles.itemButton, isActive && styles.itemActive)}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={handleClick}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemLabel}>{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);
MobileNav.displayName = 'MobileNav';

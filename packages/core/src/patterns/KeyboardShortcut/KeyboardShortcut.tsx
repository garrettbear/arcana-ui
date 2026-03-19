import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import styles from './KeyboardShortcut.module.css';

export interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Key labels to display (e.g., ["⌘", "K"]) */
  keys: string[];
  /** Visual variant */
  variant?: 'default' | 'inline';
  /** Additional CSS class */
  className?: string;
}

function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent ?? '');
}

function normalizeKey(key: string): string {
  if (key === 'Meta' || key === 'Cmd' || key === '⌘') {
    return isMac() ? '⌘' : 'Ctrl';
  }
  if (key === 'Alt' || key === 'Option' || key === '⌥') {
    return isMac() ? '⌥' : 'Alt';
  }
  return key;
}

export const KeyboardShortcut = React.forwardRef<HTMLSpanElement, KeyboardShortcutProps>(
  ({ keys, variant = 'default', className, ...props }, ref) => {
    const normalized = useMemo(() => keys.map(normalizeKey), [keys]);

    return (
      <span
        ref={ref}
        className={cn(styles.shortcut, styles[`variant-${variant}`], className)}
        aria-label={`Keyboard shortcut: ${normalized.join(' + ')}`}
        {...props}
      >
        {normalized.map((key, i) => (
          <React.Fragment key={key}>
            {i > 0 && <span className={styles.separator}>+</span>}
            <kbd className={styles.key}>{key}</kbd>
          </React.Fragment>
        ))}
      </span>
    );
  },
);
KeyboardShortcut.displayName = 'KeyboardShortcut';

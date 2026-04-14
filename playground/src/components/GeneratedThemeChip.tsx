/**
 * GeneratedThemeChip — pill that surfaces the active generated theme name
 * in the playground topbar.
 *
 * Rendered only when the caller passes a non-empty `name`. The caller is
 * responsible for wiring the close handler to:
 *   1. clearActiveGeneratedName()
 *   2. remove ?theme=generated from the URL (or set it to 'light')
 *   3. applyPreset(light) so the DOM rolls back to a known base
 */

import styles from './GeneratedThemeChip.module.css';

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export interface GeneratedThemeChipProps {
  name: string;
  onClear: () => void;
}

export function GeneratedThemeChip({ name, onClear }: GeneratedThemeChipProps) {
  return (
    <div className={styles.chip} aria-label={`Active generated theme: ${name}`}>
      <span className={styles.prefix}>Generated</span>
      <span className={styles.name} title={name}>
        {name}
      </span>
      <button
        type="button"
        onClick={onClear}
        className={styles.close}
        aria-label="Clear generated theme"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

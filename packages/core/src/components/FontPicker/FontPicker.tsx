/**
 * FontPicker — Searchable font selector with Google Fonts integration
 *
 * Features:
 * - Searchable dropdown with grouped categories (Sans, Serif, Mono)
 * - Google Font loading via link injection
 * - Local/uploaded font support
 * - Each option rendered in its own font for live preview
 * - Click-outside dismissal
 */

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';
import styles from './FontPicker.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GoogleFontEntry {
  /** Font name as it appears on Google Fonts */
  name: string;
  /** Font category */
  category: 'sans' | 'serif' | 'mono';
  /** Font weights, semicolon-separated (e.g. "400;500;600;700") */
  weights: string;
}

export interface LocalFontEntry {
  /** Display name */
  name: string;
  /** CSS font-family stack */
  stack: string;
}

// ─── Default curated fonts ──────────────────────────────────────────────────

const DEFAULT_GOOGLE_FONTS: GoogleFontEntry[] = [
  { name: 'Inter', category: 'sans', weights: '400;500;600;700' },
  { name: 'Plus Jakarta Sans', category: 'sans', weights: '400;500;600;700' },
  { name: 'DM Sans', category: 'sans', weights: '400;500;600;700' },
  { name: 'Nunito', category: 'sans', weights: '400;500;600;700' },
  { name: 'Poppins', category: 'sans', weights: '400;500;600;700' },
  { name: 'Raleway', category: 'sans', weights: '400;500;600;700' },
  { name: 'Lato', category: 'sans', weights: '400;700' },
  { name: 'Montserrat', category: 'sans', weights: '400;500;600;700' },
  { name: 'Open Sans', category: 'sans', weights: '400;500;600;700' },
  { name: 'Roboto', category: 'sans', weights: '400;500;700' },
  { name: 'Figtree', category: 'sans', weights: '400;500;600;700' },
  { name: 'Sora', category: 'sans', weights: '400;500;600;700' },
  { name: 'Outfit', category: 'sans', weights: '400;500;600;700' },
  { name: 'Work Sans', category: 'sans', weights: '400;500;600;700' },
  { name: 'Manrope', category: 'sans', weights: '400;500;600;700' },
  { name: 'IBM Plex Sans', category: 'sans', weights: '400;500;600;700' },
  { name: 'Bricolage Grotesque', category: 'sans', weights: '400;500;600;700' },
  { name: 'Playfair Display', category: 'serif', weights: '400;500;600;700' },
  { name: 'Libre Baskerville', category: 'serif', weights: '400;700' },
  { name: 'Merriweather', category: 'serif', weights: '400;700' },
  { name: 'EB Garamond', category: 'serif', weights: '400;500;600;700' },
  { name: 'Lora', category: 'serif', weights: '400;500;600;700' },
  { name: 'Source Serif 4', category: 'serif', weights: '400;500;600;700' },
  { name: 'Bitter', category: 'serif', weights: '400;500;600;700' },
  { name: 'JetBrains Mono', category: 'mono', weights: '400;500' },
  { name: 'Fira Code', category: 'mono', weights: '400;500' },
  { name: 'Source Code Pro', category: 'mono', weights: '400;500' },
  { name: 'IBM Plex Mono', category: 'mono', weights: '400;500' },
  { name: 'Roboto Mono', category: 'mono', weights: '400;500' },
  { name: 'Inconsolata', category: 'mono', weights: '400;500' },
  { name: 'Space Mono', category: 'mono', weights: '400;700' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function fontToStack(font: GoogleFontEntry): string {
  const fallback =
    font.category === 'mono' ? 'monospace' : font.category === 'serif' ? 'serif' : 'sans-serif';
  return `'${font.name}', ${fallback}`;
}

function loadGoogleFont(font: GoogleFontEntry): void {
  if (typeof document === 'undefined') return;
  const id = `gf-${font.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@${font.weights}&display=swap`;
  document.head.appendChild(link);
}

function getFirstFontName(stack: string): string {
  return stack.split(',')[0].trim().replace(/['"]/g, '');
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface FontPickerProps {
  /** Current font-family stack value */
  value: string;
  /** Called when a font is selected */
  onChange: (fontStack: string) => void;
  /** Label text displayed on the trigger */
  label?: string;
  /** Google Fonts to offer (defaults to a curated list of ~31 fonts) */
  googleFonts?: GoogleFontEntry[];
  /** Locally uploaded fonts */
  localFonts?: LocalFontEntry[];
  /** Show search input (default true) */
  searchable?: boolean;
  /** Placeholder text for search */
  searchPlaceholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FontPicker = forwardRef<HTMLDivElement, FontPickerProps>(
  (
    {
      value,
      onChange,
      label,
      googleFonts = DEFAULT_GOOGLE_FONTS,
      localFonts = [],
      searchable = true,
      searchPlaceholder = 'Search fonts\u2026',
      size = 'md',
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Click outside to close
    useClickOutside(
      wrapperRef,
      () => {
        setOpen(false);
        setSearch('');
      },
      open,
    );

    // Auto-focus search on open
    useEffect(() => {
      if (open) setTimeout(() => inputRef.current?.focus(), 0);
    }, [open]);

    const filtered = useMemo(() => {
      const q = search.toLowerCase();
      const gf = q ? googleFonts.filter((f) => f.name.toLowerCase().includes(q)) : googleFonts;
      const lf = localFonts.filter((f) => !q || f.name.toLowerCase().includes(q));
      return { googleFonts: gf, localFonts: lf };
    }, [search, googleFonts, localFonts]);

    const handleSelect = (font: GoogleFontEntry) => {
      loadGoogleFont(font);
      onChange(fontToStack(font));
      setOpen(false);
      setSearch('');
    };

    const handleLocalSelect = (font: LocalFontEntry) => {
      onChange(font.stack);
      setOpen(false);
      setSearch('');
    };

    const currentName = getFirstFontName(value);
    const sizeClass = size !== 'md' ? styles[`root--${size}`] : '';

    return (
      <div ref={setRefs} className={cn(styles.root, sizeClass, className)}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={open}
        >
          {label && <span className={styles.triggerLabel}>{label}</span>}
          <span className={styles.triggerValue} style={{ fontFamily: value }}>
            {currentName}
          </span>
          <span className={styles.chevron}>{open ? '\u25B4' : '\u25BE'}</span>
        </button>

        {open && (
          <div className={styles.dropdown}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.search}
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className={styles.list}>
              {filtered.localFonts.length > 0 && (
                <>
                  <div className={styles.groupLabel}>Uploaded</div>
                  {filtered.localFonts.map((font) => (
                    <button
                      key={font.name}
                      type="button"
                      aria-pressed={currentName === font.name}
                      className={cn(
                        styles.option,
                        currentName === font.name && styles.optionActive,
                      )}
                      style={{ fontFamily: font.stack }}
                      onClick={() => handleLocalSelect(font)}
                    >
                      {font.name}
                      <span className={styles.optionBadge}>local</span>
                    </button>
                  ))}
                </>
              )}
              {(['sans', 'serif', 'mono'] as const).map((cat) => {
                const catFonts = filtered.googleFonts.filter((f) => f.category === cat);
                if (!catFonts.length) return null;
                const catLabel =
                  cat === 'sans' ? 'Sans-Serif' : cat === 'serif' ? 'Serif' : 'Monospace';
                return (
                  <React.Fragment key={cat}>
                    <div className={styles.groupLabel}>{catLabel}</div>
                    {catFonts.map((font) => (
                      <button
                        key={font.name}
                        type="button"
                        aria-pressed={currentName === font.name}
                        className={cn(
                          styles.option,
                          currentName === font.name && styles.optionActive,
                        )}
                        style={{
                          fontFamily: `'${font.name}', ${font.category === 'mono' ? 'monospace' : font.category}`,
                        }}
                        onClick={() => handleSelect(font)}
                      >
                        {font.name}
                      </button>
                    ))}
                  </React.Fragment>
                );
              })}
              {filtered.googleFonts.length === 0 && filtered.localFonts.length === 0 && (
                <div className={styles.empty}>No fonts match &ldquo;{search}&rdquo;</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
FontPicker.displayName = 'FontPicker';

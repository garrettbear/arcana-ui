import { Button } from '@arcana-ui/core';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type GeneratedTheme, readGeneratedThemes, stashPickedTheme } from '../utils/generateTheme';
import styles from './Generate.module.css';

/**
 * /generate — preview + pick step for the AI theme generation flow.
 *
 * Expects sessionStorage entry written by the Landing hero input. If the
 * entry is missing (direct navigation, refresh after clear), redirects
 * back to Landing so the user can start over with a fresh prompt.
 */
export default function Generate() {
  const navigate = useNavigate();
  const [stashed, setStashed] = useState(() => readGeneratedThemes());

  // Re-read on focus so a user bouncing tabs doesn't get a stale cache.
  useEffect(() => {
    const handler = () => setStashed(readGeneratedThemes());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  useEffect(() => {
    if (!stashed) {
      navigate('/', { replace: true });
    }
  }, [stashed, navigate]);

  if (!stashed) return null;

  const { prompt, response } = stashed;
  const themes = response.themes;

  const handlePick = (theme: GeneratedTheme) => {
    stashPickedTheme(theme);
    navigate('/playground?theme=generated');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back} aria-label="Back to landing">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
        <div className={styles.meta}>
          <span className={styles.metaLabel}>Prompt</span>
          <p className={styles.metaPrompt}>"{prompt}"</p>
        </div>
        <div className={styles.metaModel}>
          <span className={styles.metaBadge}>{response.meta.byok ? 'Your key' : 'Shared'}</span>
          <span className={styles.metaBadge}>{formatModel(response.meta.model)}</span>
        </div>
      </header>

      <section className={styles.grid}>
        {themes.map((theme, i) => (
          <ThemeCard key={`${theme.name}-${i}`} theme={theme} onPick={() => handlePick(theme)} />
        ))}
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerHint}>
          Don't love them?{' '}
          <Link to="/" className={styles.link}>
            Try a different prompt
          </Link>
        </p>
      </footer>
    </div>
  );
}

// ─── Theme preview card ──────────────────────────────────────────────────────

function ThemeCard({ theme, onPick }: { theme: GeneratedTheme; onPick: () => void }) {
  const preview = useMemo(() => resolveThemePreview(theme), [theme]);

  return (
    <article className={styles.card}>
      <div
        className={styles.cardPreview}
        style={
          {
            '--_bg': preview.bg,
            '--_surface': preview.surface,
            '--_fg': preview.fg,
            '--_fgMuted': preview.fgMuted,
            '--_action': preview.action,
            '--_actionFg': preview.actionFg,
            '--_border': preview.border,
            '--_radius': preview.radius,
            '--_font': preview.font,
          } as React.CSSProperties
        }
      >
        <div className={styles.cardPreviewHeader}>
          <div className={styles.cardPreviewDot} />
          <div className={styles.cardPreviewDot} />
          <div className={styles.cardPreviewDot} />
        </div>
        <div className={styles.cardPreviewBody}>
          <div className={styles.cardPreviewHeadline}>Aa</div>
          <div className={styles.cardPreviewCard}>
            <div className={styles.cardPreviewLine} style={{ width: '70%' }} />
            <div className={styles.cardPreviewLine} style={{ width: '40%' }} />
            <div className={styles.cardPreviewActionRow}>
              <span className={styles.cardPreviewButton}>Get started</span>
              <span className={styles.cardPreviewButtonGhost}>Learn</span>
            </div>
          </div>
          <div className={styles.cardPreviewSwatches}>
            {preview.swatches.map((c) => (
              <span key={c} className={styles.cardPreviewSwatch} style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.cardMeta}>
        <h3 className={styles.cardName}>{theme.name}</h3>
        <p className={styles.cardDesc}>{theme.description}</p>
        <Button variant="primary" onClick={onPick} fullWidth>
          Use this theme
        </Button>
      </div>
    </article>
  );
}

// ─── Utilities ───────────────────────────────────────────────────────────────

interface ThemePreview {
  bg: string;
  surface: string;
  fg: string;
  fgMuted: string;
  action: string;
  actionFg: string;
  border: string;
  radius: string;
  font: string;
  swatches: string[];
}

/**
 * Resolves the simplified generated theme JSON into a flat set of preview
 * values. Semantic references like `{primitive.color.brand.500}` are looked
 * up against the primitive block. Fallbacks are sensible so a partial theme
 * still renders something reasonable.
 */
function resolveThemePreview(theme: GeneratedTheme): ThemePreview {
  const primitive = theme.primitive ?? {};
  const semantic = theme.semantic ?? {};

  const resolve = (value: unknown, fallback: string): string => {
    if (typeof value !== 'string') return fallback;
    const match = /^\{(.+)\}$/.exec(value.trim());
    if (!match) return value;
    const path = match[1].split('.');
    let cursor: unknown = { primitive, semantic };
    for (const key of path) {
      if (cursor && typeof cursor === 'object' && key in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[key];
      } else {
        return fallback;
      }
    }
    return typeof cursor === 'string' ? cursor : fallback;
  };

  const semBg = getPath(semantic, ['color', 'background', 'default']);
  const semSurface = getPath(semantic, ['color', 'background', 'surface']);
  const semFg = getPath(semantic, ['color', 'foreground', 'primary']);
  const semFgMuted = getPath(semantic, ['color', 'foreground', 'secondary']);
  const semAction = getPath(semantic, ['color', 'action', 'primary']);
  const semBorder = getPath(semantic, ['color', 'border', 'default']);

  const bg = resolve(semBg, '#ffffff');
  const surface = resolve(semSurface, bg);
  const fg = resolve(semFg, '#111111');
  const fgMuted = resolve(semFgMuted, '#666666');
  const action = resolve(semAction, '#4f46e5');
  const border = resolve(semBorder, 'rgba(0,0,0,0.1)');
  const actionFg = contrastOn(action);

  const radius =
    getPathString(primitive, ['radius', 'md']) ??
    getPathString(primitive, ['radius', 'lg']) ??
    '0.5rem';

  const displayFont =
    getPathString(primitive, ['font', 'display']) ??
    getPathString(primitive, ['font', 'body']) ??
    'system-ui, sans-serif';

  // Pull the most informative palette entries for swatches (prefer brand ramp,
  // fall back to accent and neutral anchors).
  const brand = getPath(primitive, ['color', 'brand']) as Record<string, string> | undefined;
  const accent = getPath(primitive, ['color', 'accent']) as Record<string, string> | undefined;
  const neutral = getPath(primitive, ['color', 'neutral']) as Record<string, string> | undefined;
  const swatches = [
    brand?.['300'],
    brand?.['500'],
    brand?.['700'],
    accent?.['500'],
    neutral?.['500'],
    neutral?.['900'],
  ]
    .filter((c): c is string => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c))
    .slice(0, 6);

  return {
    bg,
    surface,
    fg,
    fgMuted,
    action,
    actionFg,
    border,
    radius,
    font: displayFont,
    swatches,
  };
}

function getPath(obj: unknown, keys: string[]): unknown {
  let cursor: unknown = obj;
  for (const k of keys) {
    if (cursor && typeof cursor === 'object' && k in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return cursor;
}

function getPathString(obj: unknown, keys: string[]): string | undefined {
  const v = getPath(obj, keys);
  return typeof v === 'string' ? v : undefined;
}

/** Return black or white depending on which has better contrast on the background. */
function contrastOn(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return '#ffffff';
  // Relative luminance (sRGB, simplified)
  const [r, g, b] = rgb.map((c) => c / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? '#0a0a0a' : '#ffffff';
}

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function formatModel(model: string): string {
  if (model.includes('haiku')) return 'Haiku 4.5';
  if (model.includes('sonnet')) return 'Sonnet 4.6';
  if (model.includes('opus')) return 'Opus 4.6';
  return model;
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toHex } from '../utils/contrast';
import { PRESETS, type PresetId, type ThemePreset, applyPreset, getCSSVar } from '../utils/presets';
import styles from './TokenEditor.module.css';

// ─── Google Fonts ─────────────────────────────────────────────────────────────

const GOOGLE_FONTS = [
  // Sans-serif
  { name: 'Inter', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Plus Jakarta Sans', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'DM Sans', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Nunito', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Poppins', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Raleway', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Lato', category: 'sans' as const, weights: '400;700' },
  { name: 'Montserrat', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Open Sans', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Roboto', category: 'sans' as const, weights: '400;500;700' },
  { name: 'Figtree', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Sora', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Outfit', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Work Sans', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Manrope', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'IBM Plex Sans', category: 'sans' as const, weights: '400;500;600;700' },
  { name: 'Bricolage Grotesque', category: 'sans' as const, weights: '400;500;600;700' },
  // Serif
  { name: 'Playfair Display', category: 'serif' as const, weights: '400;500;600;700' },
  { name: 'Libre Baskerville', category: 'serif' as const, weights: '400;700' },
  { name: 'Merriweather', category: 'serif' as const, weights: '400;700' },
  { name: 'EB Garamond', category: 'serif' as const, weights: '400;500;600;700' },
  { name: 'Lora', category: 'serif' as const, weights: '400;500;600;700' },
  { name: 'Source Serif 4', category: 'serif' as const, weights: '400;500;600;700' },
  { name: 'Bitter', category: 'serif' as const, weights: '400;500;600;700' },
  // Monospace
  { name: 'JetBrains Mono', category: 'mono' as const, weights: '400;500' },
  { name: 'Fira Code', category: 'mono' as const, weights: '400;500' },
  { name: 'Source Code Pro', category: 'mono' as const, weights: '400;500' },
  { name: 'IBM Plex Mono', category: 'mono' as const, weights: '400;500' },
  { name: 'Roboto Mono', category: 'mono' as const, weights: '400;500' },
  { name: 'Inconsolata', category: 'mono' as const, weights: '400;500' },
  { name: 'Space Mono', category: 'mono' as const, weights: '400;700' },
];

type GoogleFont = (typeof GOOGLE_FONTS)[number];

function fontToStack(
  font: GoogleFont | { name: string; category: 'sans' | 'serif' | 'mono' },
): string {
  const fallback =
    font.category === 'mono' ? 'monospace' : font.category === 'serif' ? 'serif' : 'sans-serif';
  return `'${font.name}', ${fallback}`;
}

function loadGoogleFont(font: GoogleFont): void {
  const id = `gf-${font.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  const family = font.name.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@${font.weights}&display=swap`;
  document.head.appendChild(link);
}

// ─── Token Groups ─────────────────────────────────────────────────────────────

const TOKEN_GROUPS: Array<{
  label: string;
  tokens: Array<{ label: string; var: string }>;
}> = [
  {
    label: 'Surface',
    tokens: [
      { label: 'Background', var: '--color-bg-page' },
      { label: 'Secondary', var: '--color-bg-surface' },
      { label: 'Card / Elevated', var: '--color-bg-elevated' },
    ],
  },
  {
    label: 'Action',
    tokens: [
      { label: 'Primary', var: '--color-action-primary' },
      { label: 'Primary Hover', var: '--color-action-primary-hover' },
      { label: 'Danger', var: '--color-action-destructive' },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { label: 'Primary', var: '--color-fg-primary' },
      { label: 'Secondary', var: '--color-fg-secondary' },
      { label: 'Muted', var: '--color-fg-muted' },
      { label: 'On Action', var: '--color-fg-on-primary' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { label: 'Default', var: '--color-border-default' },
      { label: 'Focus Ring', var: '--color-border-focus' },
    ],
  },
  {
    label: 'Feedback',
    tokens: [
      { label: 'Success', var: '--color-status-success' },
      { label: 'Warning', var: '--color-status-warning' },
      { label: 'Error', var: '--color-status-error' },
      { label: 'Info', var: '--color-status-info' },
    ],
  },
];

const ALL_EDITOR_VARS = TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => t.var));

// ─── Type Scale ───────────────────────────────────────────────────────────────

const TYPE_SCALE_STEPS = [
  { key: '5xl', step: 6, label: 'h1', cssVar: '--font-size-5xl' },
  { key: '4xl', step: 4, label: 'h2', cssVar: '--font-size-4xl' },
  { key: '3xl', step: 3, label: 'h3', cssVar: '--font-size-3xl' },
  { key: '2xl', step: 2, label: 'h4', cssVar: '--font-size-2xl' },
  { key: 'xl', step: 1, label: 'h5', cssVar: '--font-size-xl' },
  { key: 'lg', step: 0.5, label: 'h6', cssVar: '--font-size-lg' },
  { key: 'base', step: 0, label: 'body', cssVar: '--font-size-base' },
  { key: 'sm', step: -1, label: 'small', cssVar: '--font-size-sm' },
  { key: 'xs', step: -2, label: 'xs', cssVar: '--font-size-xs' },
];

const TYPE_SCALE_RATIOS = [
  { label: 'Minor Second', value: 1.067 },
  { label: 'Major Second', value: 1.125 },
  { label: 'Minor Third', value: 1.2 },
  { label: 'Major Third', value: 1.25 },
  { label: 'Perfect Fourth', value: 1.333 },
  { label: 'Augmented Fourth', value: Math.SQRT2 },
  { label: 'Perfect Fifth', value: 1.5 },
  { label: 'Golden Ratio', value: 1.618 },
];

function computeFontSize(base: number, ratio: number, step: number): number {
  return base * ratio ** step;
}

// ─── Spacing Scale ────────────────────────────────────────────────────────────

const SPACING_PREVIEW_STEPS = [
  { multiplier: 0.5, label: '0.5', cssVar: '--spacing-0-5' },
  { multiplier: 1, label: '1', cssVar: '--spacing-1' },
  { multiplier: 2, label: '2', cssVar: '--spacing-2' },
  { multiplier: 3, label: '3', cssVar: '--spacing-3' },
  { multiplier: 4, label: '4', cssVar: '--spacing-4' },
  { multiplier: 5, label: '5', cssVar: '--spacing-5' },
  { multiplier: 6, label: '6', cssVar: '--spacing-6' },
  { multiplier: 8, label: '8', cssVar: '--spacing-8' },
  { multiplier: 10, label: '10', cssVar: '--spacing-10' },
  { multiplier: 12, label: '12', cssVar: '--spacing-12' },
  { multiplier: 16, label: '16', cssVar: '--spacing-16' },
];

const ALL_SPACING_STEPS = [
  { multiplier: 0.5, cssVar: '--spacing-0-5' },
  { multiplier: 1, cssVar: '--spacing-1' },
  { multiplier: 1.5, cssVar: '--spacing-1-5' },
  { multiplier: 2, cssVar: '--spacing-2' },
  { multiplier: 2.5, cssVar: '--spacing-2-5' },
  { multiplier: 3, cssVar: '--spacing-3' },
  { multiplier: 3.5, cssVar: '--spacing-3-5' },
  { multiplier: 4, cssVar: '--spacing-4' },
  { multiplier: 5, cssVar: '--spacing-5' },
  { multiplier: 6, cssVar: '--spacing-6' },
  { multiplier: 7, cssVar: '--spacing-7' },
  { multiplier: 8, cssVar: '--spacing-8' },
  { multiplier: 10, cssVar: '--spacing-10' },
  { multiplier: 12, cssVar: '--spacing-12' },
  { multiplier: 14, cssVar: '--spacing-14' },
  { multiplier: 16, cssVar: '--spacing-16' },
  { multiplier: 20, cssVar: '--spacing-20' },
  { multiplier: 24, cssVar: '--spacing-24' },
  { multiplier: 32, cssVar: '--spacing-32' },
];

// ─── FontPicker ───────────────────────────────────────────────────────────────

interface LocalFont {
  name: string;
  stack: string;
}

interface FontPickerProps {
  label: string;
  value: string;
  localFonts: LocalFont[];
  onChange: (stack: string) => void;
}

function getFirstFontName(stack: string): string {
  return stack.split(',')[0].trim().replace(/['"]/g, '');
}

function FontPicker({ label, value, localFonts, onChange }: FontPickerProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const gf = q ? GOOGLE_FONTS.filter((f) => f.name.toLowerCase().includes(q)) : GOOGLE_FONTS;
    const lf = localFonts.filter((f) => !q || f.name.toLowerCase().includes(q));
    return { googleFonts: gf, localFonts: lf };
  }, [search, localFonts]);

  const handleSelect = (font: GoogleFont) => {
    loadGoogleFont(font);
    onChange(fontToStack(font));
    setOpen(false);
    setSearch('');
  };

  const handleLocalSelect = (font: LocalFont) => {
    onChange(font.stack);
    setOpen(false);
    setSearch('');
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const currentName = getFirstFontName(value);

  return (
    <div ref={wrapperRef} className={styles.fontPicker}>
      <div
        className={styles.fontPickerTrigger}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        <span className={styles.fontPickerTriggerLabel}>{label}</span>
        <span className={styles.fontPickerTriggerValue} style={{ fontFamily: value }}>
          {currentName}
        </span>
        <span className={styles.fontPickerChevron}>{open ? '▴' : '▾'}</span>
      </div>

      {open && (
        <div className={styles.fontPickerDropdown}>
          <div className={styles.fontPickerSearchWrapper}>
            <input
              ref={inputRef}
              type="text"
              className={styles.fontPickerSearch}
              placeholder="Search fonts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.fontPickerList}>
            {filtered.localFonts.length > 0 && (
              <>
                <div className={styles.fontPickerGroupLabel}>Uploaded</div>
                {filtered.localFonts.map((font) => (
                  <button
                    key={font.name}
                    className={`${styles.fontPickerOption} ${currentName === font.name ? styles.fontPickerOptionActive : ''}`}
                    style={{ fontFamily: font.stack }}
                    onClick={() => handleLocalSelect(font)}
                  >
                    {font.name}
                    <span className={styles.fontPickerOptionBadge}>local</span>
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
                  <div className={styles.fontPickerGroupLabel}>{catLabel}</div>
                  {catFonts.map((font) => (
                    <button
                      key={font.name}
                      className={`${styles.fontPickerOption} ${currentName === font.name ? styles.fontPickerOptionActive : ''}`}
                      onClick={() => handleSelect(font)}
                    >
                      {font.name}
                    </button>
                  ))}
                </React.Fragment>
              );
            })}
            {filtered.googleFonts.length === 0 && filtered.localFonts.length === 0 && (
              <div className={styles.fontPickerEmpty}>No fonts match "{search}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TokenEditorProps {
  activePresetId: PresetId;
  onPresetChange: (id: PresetId) => void;
}

export function TokenEditor({ activePresetId, onPresetChange }: TokenEditorProps) {
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({});
  const [radius, setRadius] = useState(8);
  const [displayFont, setDisplayFont] = useState("'Playfair Display', serif");
  const [bodyFont, setBodyFont] = useState('Inter, system-ui, -apple-system, sans-serif');
  const [monoFont, setMonoFont] = useState(
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  );
  const [typeBaseSize, setTypeBaseSize] = useState(16);
  const [typeRatio, setTypeRatio] = useState(1.25);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [spacingBase, setSpacingBase] = useState(4);
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['presets', 'typography']));
  const [openColorGroups, setOpenColorGroups] = useState<Set<string>>(
    new Set(['Surface', 'Action', 'Text']),
  );
  const [copied, setCopied] = useState(false);

  const refreshValues = useCallback(() => {
    const values: Record<string, string> = {};
    for (const varName of ALL_EDITOR_VARS) {
      values[varName] = getCSSVar(varName);
    }
    setTokenValues(values);

    const r = getCSSVar('--radius-md');
    setRadius(Number.parseInt(r) || 8);

    const sans = getCSSVar('--font-family-body');
    if (sans) setBodyFont(sans);

    const mono = getCSSVar('--font-family-mono');
    if (mono) setMonoFont(mono);
  }, []);

  useEffect(() => {
    const timer = setTimeout(refreshValues, 50);
    return () => clearTimeout(timer);
  }, [activePresetId, refreshValues]);

  const applyTypeScale = useCallback((base: number, ratio: number) => {
    for (const step of TYPE_SCALE_STEPS) {
      const px = computeFontSize(base, ratio, step.step);
      document.documentElement.style.setProperty(step.cssVar, `${px.toFixed(3)}px`);
    }
  }, []);

  const applySpacingScale = useCallback((base: number) => {
    for (const step of ALL_SPACING_STEPS) {
      document.documentElement.style.setProperty(step.cssVar, `${step.multiplier * base}px`);
    }
  }, []);

  const handlePresetSelect = (preset: ThemePreset) => {
    applyPreset(preset);
    onPresetChange(preset.id);
  };

  const handleColorChange = (varName: string, value: string) => {
    setTokenValues((prev) => ({ ...prev, [varName]: value }));
    document.documentElement.style.setProperty(varName, value);
  };

  const handleRadiusChange = (value: number) => {
    setRadius(value);
    document.documentElement.style.setProperty('--radius-md', `${value}px`);
  };

  const handleDisplayFontChange = (stack: string) => {
    setDisplayFont(stack);
    document.documentElement.style.setProperty('--font-family-display', stack);
  };

  const handleBodyFontChange = (stack: string) => {
    setBodyFont(stack);
    document.documentElement.style.setProperty('--font-family-body', stack);
  };

  const handleMonoFontChange = (stack: string) => {
    setMonoFont(stack);
    document.documentElement.style.setProperty('--font-family-mono', stack);
  };

  const handleTypeSizeChange = (value: number) => {
    setTypeBaseSize(value);
    applyTypeScale(value, typeRatio);
  };

  const handleTypeRatioChange = (value: number) => {
    setTypeRatio(value);
    applyTypeScale(typeBaseSize, value);
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    document.documentElement.style.setProperty('--line-height-normal', String(value));
  };

  const handleSpacingBaseChange = (value: number) => {
    setSpacingBase(value);
    applySpacingScale(value);
  };

  const handleLocalFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fontName = file.name
      .replace(/\.(woff2?|ttf|otf)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    const url = URL.createObjectURL(file);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const format =
      ext === 'woff2' ? 'woff2' : ext === 'woff' ? 'woff' : ext === 'ttf' ? 'truetype' : 'opentype';
    const styleEl = document.createElement('style');
    styleEl.textContent = `@font-face { font-family: '${fontName}'; src: url('${url}') format('${format}'); font-display: swap; }`;
    document.head.appendChild(styleEl);
    setLocalFonts((prev) => [...prev, { name: fontName, stack: `'${fontName}', sans-serif` }]);
    e.target.value = '';
  };

  const handleReset = () => {
    const lightPreset = PRESETS.find((p) => p.id === 'light')!;
    applyPreset(lightPreset);
    onPresetChange('light');
    setTypeBaseSize(16);
    setTypeRatio(1.25);
    setLineHeight(1.5);
    setSpacingBase(4);
    setDisplayFont("'Playfair Display', serif");
    for (const step of TYPE_SCALE_STEPS) {
      document.documentElement.style.removeProperty(step.cssVar);
    }
    for (const step of ALL_SPACING_STEPS) {
      document.documentElement.style.removeProperty(step.cssVar);
    }
    document.documentElement.style.removeProperty('--line-height-normal');
    document.documentElement.style.removeProperty('--font-family-display');
  };

  const handleExport = async () => {
    const exportObj: Record<string, string> = {};
    for (const varName of ALL_EDITOR_VARS) {
      exportObj[varName] = getCSSVar(varName);
    }
    exportObj['--radius-md'] = `${radius}px`;
    exportObj['--font-family-display'] = displayFont;
    exportObj['--font-family-body'] = bodyFont;
    exportObj['--font-family-mono'] = monoFont;
    exportObj['--line-height-normal'] = String(lineHeight);
    for (const step of TYPE_SCALE_STEPS) {
      exportObj[step.cssVar] = getCSSVar(step.cssVar);
    }
    for (const step of ALL_SPACING_STEPS) {
      exportObj[step.cssVar] = getCSSVar(step.cssVar);
    }

    const json = JSON.stringify(exportObj, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arcana-theme-${activePresetId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleSection = (name: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleColorGroup = (label: string) => {
    setOpenColorGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <div className={styles.editor}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <span className={styles.editorTitle}>Token Editor</span>
      </div>

      {/* ── 1. Theme Presets ── */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('presets')}>
          <span className={styles.sectionToggle}>{openSections.has('presets') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Theme Presets</span>
        </button>
        {openSections.has('presets') && (
          <div className={styles.presetGrid}>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`${styles.presetBtn} ${activePresetId === preset.id ? styles.presetActive : ''}`}
                onClick={() => handlePresetSelect(preset)}
                title={preset.description}
              >
                <span className={styles.presetEmoji}>{preset.emoji}</span>
                <span className={styles.presetLabel}>{preset.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. Colors ── */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('colors')}>
          <span className={styles.sectionToggle}>{openSections.has('colors') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Colors</span>
        </button>
        {openSections.has('colors') && (
          <div className={styles.subSections}>
            {TOKEN_GROUPS.map((group) => (
              <div key={group.label}>
                <button
                  className={styles.groupHeader}
                  onClick={() => toggleColorGroup(group.label)}
                >
                  <span className={styles.groupToggle}>
                    {openColorGroups.has(group.label) ? '▾' : '▸'}
                  </span>
                  <span className={styles.groupLabel}>{group.label}</span>
                </button>
                {openColorGroups.has(group.label) && (
                  <div className={styles.tokenList}>
                    {group.tokens.map((token) => {
                      const currentVal = tokenValues[token.var] ?? '#000000';
                      const hexVal = toHex(currentVal);
                      return (
                        <div key={token.var} className={styles.tokenRow}>
                          <label className={styles.tokenLabel}>{token.label}</label>
                          <div className={styles.tokenInputs}>
                            <input
                              type="color"
                              className={styles.colorPicker}
                              value={hexVal}
                              onChange={(e) => handleColorChange(token.var, e.target.value)}
                            />
                            <span className={styles.colorValue}>{hexVal.toUpperCase()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Typography ── */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('typography')}>
          <span className={styles.sectionToggle}>{openSections.has('typography') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Typography</span>
        </button>
        {openSections.has('typography') && (
          <div className={styles.sectionBody}>
            {/* Font Pickers */}
            <p className={styles.subSectionLabel}>Font Slots</p>
            <div className={styles.fontSlots}>
              <FontPicker
                label="Display"
                value={displayFont}
                localFonts={localFonts}
                onChange={handleDisplayFontChange}
              />
              <FontPicker
                label="Body"
                value={bodyFont}
                localFonts={localFonts}
                onChange={handleBodyFontChange}
              />
              <FontPicker
                label="Mono"
                value={monoFont}
                localFonts={localFonts}
                onChange={handleMonoFontChange}
              />
            </div>

            {/* Type Scale */}
            <p className={styles.subSectionLabel}>Type Scale</p>
            <div className={styles.sliderRow}>
              <label className={styles.tokenLabel}>Base Size</label>
              <div className={styles.sliderControl}>
                <input
                  type="range"
                  className={styles.slider}
                  min={12}
                  max={24}
                  step={0.5}
                  value={typeBaseSize}
                  onChange={(e) => handleTypeSizeChange(Number.parseFloat(e.target.value))}
                />
                <span className={styles.sliderValue}>{typeBaseSize}px</span>
              </div>
            </div>
            <div className={styles.tokenRow}>
              <label className={styles.tokenLabel}>Scale Ratio</label>
              <select
                className={styles.fontSelect}
                value={typeRatio}
                onChange={(e) => handleTypeRatioChange(Number.parseFloat(e.target.value))}
              >
                {TYPE_SCALE_RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label} ({r.value})
                  </option>
                ))}
              </select>
            </div>
            {/* Scale preview */}
            <div className={styles.typeScalePreview}>
              {TYPE_SCALE_STEPS.map((step) => {
                const px = computeFontSize(typeBaseSize, typeRatio, step.step);
                const clampedPx = Math.min(px, 36);
                return (
                  <div key={step.key} className={styles.typeScaleRow}>
                    <span className={styles.typeScaleTag}>{step.label}</span>
                    <span
                      className={styles.typeScaleSample}
                      style={{ fontSize: `${clampedPx.toFixed(1)}px`, fontFamily: bodyFont }}
                    >
                      Ag
                    </span>
                    <span className={styles.typeScaleSize}>{px.toFixed(1)}px</span>
                  </div>
                );
              })}
            </div>

            {/* Line Height */}
            <div className={styles.sliderRow}>
              <label className={styles.tokenLabel}>Line Height</label>
              <div className={styles.sliderControl}>
                <input
                  type="range"
                  className={styles.slider}
                  min={1.0}
                  max={2.0}
                  step={0.05}
                  value={lineHeight}
                  onChange={(e) => handleLineHeightChange(Number.parseFloat(e.target.value))}
                />
                <span className={styles.sliderValue}>{lineHeight.toFixed(2)}</span>
              </div>
            </div>

            {/* Local Font Upload */}
            <div className={styles.localFontUpload}>
              <label className={styles.localFontLabel}>
                <span className={styles.localFontLabelText}>Upload Font</span>
                <span className={styles.localFontHint}>.woff2 .woff .ttf .otf</span>
                <input
                  type="file"
                  accept=".woff2,.woff,.ttf,.otf"
                  className={styles.localFontInput}
                  onChange={handleLocalFontUpload}
                />
              </label>
              {localFonts.length > 0 && (
                <div className={styles.localFontList}>
                  {localFonts.map((f) => (
                    <span
                      key={f.name}
                      className={styles.localFontChip}
                      style={{ fontFamily: f.stack }}
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Spacing ── */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('spacing')}>
          <span className={styles.sectionToggle}>{openSections.has('spacing') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Spacing</span>
        </button>
        {openSections.has('spacing') && (
          <div className={styles.sectionBody}>
            <div className={styles.sliderRow}>
              <label className={styles.tokenLabel}>Base Unit</label>
              <div className={styles.sliderControl}>
                <input
                  type="range"
                  className={styles.slider}
                  min={2}
                  max={8}
                  step={0.5}
                  value={spacingBase}
                  onChange={(e) => handleSpacingBaseChange(Number.parseFloat(e.target.value))}
                />
                <span className={styles.sliderValue}>{spacingBase}px</span>
              </div>
            </div>
            <div className={styles.spacingPreview}>
              {SPACING_PREVIEW_STEPS.map((step) => {
                const px = step.multiplier * spacingBase;
                const maxBar = 96;
                const barWidth = Math.min(px, maxBar);
                return (
                  <div key={step.label} className={styles.spacingRow}>
                    <span className={styles.spacingLabel}>{step.label}</span>
                    <div className={styles.spacingTrack}>
                      <div className={styles.spacingBlock} style={{ width: `${barWidth}px` }} />
                    </div>
                    <span className={styles.spacingValue}>{px}px</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Effects ── */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('effects')}>
          <span className={styles.sectionToggle}>{openSections.has('effects') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Effects</span>
        </button>
        {openSections.has('effects') && (
          <div className={styles.sectionBody}>
            <div className={styles.sliderRow}>
              <label className={styles.tokenLabel}>Border Radius</label>
              <div className={styles.sliderControl}>
                <input
                  type="range"
                  className={styles.slider}
                  min={0}
                  max={24}
                  step={1}
                  value={radius}
                  onChange={(e) => handleRadiusChange(Number.parseInt(e.target.value))}
                />
                <span className={styles.sliderValue}>{radius}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleReset}>
          Reset
        </button>
        <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={handleExport}>
          {copied ? '✓ Copied!' : 'Export JSON'}
        </button>
      </div>
    </div>
  );
}

/**
 * TokenEditor — Professional token editing panel
 *
 * Features:
 * - Collapsible sections with modified-count indicators
 * - Search/filter across all tokens
 * - Custom ColorPicker for every color token
 * - Undo/redo (Cmd+Z / Cmd+Shift+Z, 50-entry stack)
 * - Per-token reset (dot indicator + reset icon)
 * - Per-section reset buttons
 * - CubicBezierEditor for motion easing
 * - Mobile: hidden with desktop message
 * - All changes update CSS vars directly (<50ms)
 */

import { Button, ColorPicker, FontPicker, Input, useUndoRedo } from '@arcana-ui/core';
import type { LocalFontEntryEntry } from '@arcana-ui/core';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toHex } from '../utils/contrast';
import { PRESETS, type PresetId, type ThemePreset, applyPreset, getCSSVar } from '../utils/presets';
import { type BezierValues, CubicBezierEditor } from './CubicBezierEditor';
import styles from './TokenEditor.module.css';

// ─── Color Token Groups ───────────────────────────────────────────────────────

const COLOR_SECTIONS: Array<{
  id: string;
  label: string;
  tokens: Array<{ label: string; var: string }>;
}> = [
  {
    id: 'background',
    label: 'Background',
    tokens: [
      { label: 'Page', var: '--color-bg-page' },
      { label: 'Surface', var: '--color-bg-surface' },
      { label: 'Elevated', var: '--color-bg-elevated' },
      { label: 'Sunken', var: '--color-bg-sunken' },
    ],
  },
  {
    id: 'foreground',
    label: 'Foreground',
    tokens: [
      { label: 'Primary', var: '--color-fg-primary' },
      { label: 'Secondary', var: '--color-fg-secondary' },
      { label: 'Muted', var: '--color-fg-muted' },
      { label: 'On Primary Action', var: '--color-fg-on-primary' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    tokens: [
      { label: 'Primary', var: '--color-action-primary' },
      { label: 'Primary Hover', var: '--color-action-primary-hover' },
      { label: 'Secondary', var: '--color-action-secondary' },
      { label: 'Destructive', var: '--color-action-destructive' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    tokens: [
      { label: 'Success', var: '--color-status-success' },
      { label: 'Warning', var: '--color-status-warning' },
      { label: 'Error', var: '--color-status-error' },
      { label: 'Info', var: '--color-status-info' },
    ],
  },
  {
    id: 'borders',
    label: 'Borders',
    tokens: [
      { label: 'Default', var: '--color-border-default' },
      { label: 'Focus Ring', var: '--color-border-focus' },
      { label: 'Muted', var: '--color-border-muted' },
    ],
  },
  {
    id: 'accent',
    label: 'Accent',
    tokens: [
      { label: 'Primary', var: '--color-accent-primary' },
      { label: 'Secondary', var: '--color-accent-secondary' },
    ],
  },
];

const ALL_COLOR_VARS = COLOR_SECTIONS.flatMap((s) => s.tokens.map((t) => t.var));

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
  { label: 'Minor Second (1.067)', value: 1.067 },
  { label: 'Major Second (1.125)', value: 1.125 },
  { label: 'Minor Third (1.2)', value: 1.2 },
  { label: 'Major Third (1.25)', value: 1.25 },
  { label: 'Perfect Fourth (1.333)', value: 1.333 },
  { label: 'Augmented Fourth (√2)', value: Math.SQRT2 },
  { label: 'Perfect Fifth (1.5)', value: 1.5 },
  { label: 'Golden Ratio (1.618)', value: 1.618 },
];

function computeFontSize(base: number, ratio: number, step: number): number {
  return base * ratio ** step;
}

// ─── Spacing ──────────────────────────────────────────────────────────────────

const SPACING_PREVIEW_STEPS = [
  { multiplier: 0.5, label: '0.5', cssVar: '--spacing-0-5' },
  { multiplier: 1, label: '1', cssVar: '--spacing-1' },
  { multiplier: 2, label: '2', cssVar: '--spacing-2' },
  { multiplier: 3, label: '3', cssVar: '--spacing-3' },
  { multiplier: 4, label: '4', cssVar: '--spacing-4' },
  { multiplier: 6, label: '6', cssVar: '--spacing-6' },
  { multiplier: 8, label: '8', cssVar: '--spacing-8' },
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

// ─── Radius ───────────────────────────────────────────────────────────────────

const RADIUS_SCALE = [
  { var: '--radius-none', ratio: 0 },
  { var: '--radius-xs', ratio: 0.33 },
  { var: '--radius-sm', ratio: 0.67 },
  { var: '--radius-md', ratio: 1 },
  { var: '--radius-lg', ratio: 1.33 },
  { var: '--radius-xl', ratio: 2 },
  { var: '--radius-2xl', ratio: 2.67 },
  { var: '--radius-3xl', ratio: 4 },
];

// ─── Undo/Redo ────────────────────────────────────────────────────────────────

interface HistoryEntry {
  varName: string;
  oldValue: string;
  newValue: string;
}

// Uses useUndoRedo from @arcana-ui/core (imported above)

// FontPicker is now imported from @arcana-ui/core

// FontPicker component was here — now imported from @arcana-ui/core

// ─── Main Component ───────────────────────────────────────────────────────────

export interface TokenEditorProps {
  activePresetId: PresetId;
  onPresetChange: (id: PresetId) => void;
}

type DensityMode = 'compact' | 'default' | 'comfortable';

export function TokenEditor({
  activePresetId,
  onPresetChange,
}: TokenEditorProps): React.ReactElement {
  // ── State ──────────────────────────────────────────────────────────────────

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
  const [density, setDensity] = useState<DensityMode>('default');
  const [scale, setScale] = useState(1);
  const [localFonts, setLocalFontEntrys] = useState<LocalFontEntry[]>([]);
  const [motionDuration, setMotionDuration] = useState(200);
  const [bezier, setBezier] = useState<BezierValues>({ x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 });
  const [pendingFont, setPendingFont] = useState<LocalFontEntry | null>(null);

  // Sections: which are open
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['presets', 'colors']));
  const [openColorGroups, setOpenColorGroups] = useState<Set<string>>(
    new Set(['background', 'foreground', 'actions']),
  );

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modified tokens tracking (relative to last preset switch)
  const [modifiedVars, setModifiedVars] = useState<Set<string>>(new Set());
  const [modifiedScalars, setModifiedScalars] = useState<Set<string>>(new Set());

  // Undo/Redo
  const undoRedo = useUndoRedo<HistoryEntry>();

  // Undo toast
  const [undoToast, setUndoToast] = useState<string | null>(null);
  const undoToastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Import input ref
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // ── Theme palette (for color picker swatches) ──────────────────────────────

  const themePalette = useMemo((): string[] => {
    // Build palette from current token values
    const colors = Object.values(tokenValues)
      .filter((v) => v && (v.startsWith('#') || v.startsWith('rgb')))
      .map((v) => toHex(v))
      .filter((v, i, arr) => arr.indexOf(v) === i) // unique
      .slice(0, 16);
    return colors;
  }, [tokenValues]);

  // ── Refresh state from CSS vars ──────────────────────────────────────────

  const refreshValues = useCallback(() => {
    const values: Record<string, string> = {};
    for (const varName of ALL_COLOR_VARS) {
      values[varName] = getCSSVar(varName);
    }
    setTokenValues(values);

    const r = getCSSVar('--radius-md');
    setRadius(Number.parseInt(r) || 8);

    const display = getCSSVar('--font-family-display');
    if (display) setDisplayFont(display);
    const sans = getCSSVar('--font-family-body');
    if (sans) setBodyFont(sans);
    const mono = getCSSVar('--font-family-mono');
    if (mono) setMonoFont(mono);

    const lh = getCSSVar('--line-height-normal');
    if (lh) setLineHeight(Number.parseFloat(lh) || 1.5);

    const baseFontSize = getCSSVar('--font-size-base');
    if (baseFontSize) {
      let px = Number.parseFloat(baseFontSize);
      if (baseFontSize.includes('rem')) px = px * 16;
      if (px > 0) setTypeBaseSize(Math.round(px));
    }

    const sp1 = getCSSVar('--spacing-1');
    if (sp1) {
      const px = Number.parseFloat(sp1);
      if (px > 0) setSpacingBase(Math.round(px));
    }

    const preview = document.getElementById('preview-area');
    if (preview?.style.zoom) {
      setScale(Number.parseFloat(preview.style.zoom) || 1);
    } else {
      setScale(1);
    }

    const densityAttr = document.documentElement.getAttribute('data-density');
    if (densityAttr === 'compact' || densityAttr === 'comfortable') {
      setDensity(densityAttr);
    } else {
      setDensity('default');
    }

    const durNormal = getCSSVar('--duration-normal');
    if (durNormal) {
      const ms = Number.parseInt(durNormal);
      if (!Number.isNaN(ms)) setMotionDuration(ms);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activePresetId intentionally triggers refresh
  useEffect(() => {
    const timer = setTimeout(refreshValues, 50);
    return () => clearTimeout(timer);
  }, [activePresetId, refreshValues]);

  // ── Apply helpers ─────────────────────────────────────────────────────────

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

  const applyMotionEasing = useCallback((cssEasing: string) => {
    const root = document.documentElement;
    root.style.setProperty('--ease-default', cssEasing);
    root.style.setProperty('--ease-in', cssEasing === 'linear' ? 'linear' : 'ease-in');
    root.style.setProperty('--ease-out', cssEasing === 'linear' ? 'linear' : 'ease-out');
    root.style.setProperty('--ease-in-out', cssEasing === 'linear' ? 'linear' : 'ease-in-out');
    const dur = getCSSVar('--duration-normal') || '200ms';
    root.style.setProperty(
      '--transition-colors',
      `color ${dur} ${cssEasing}, background-color ${dur} ${cssEasing}, border-color ${dur} ${cssEasing}`,
    );
    root.style.setProperty('--transition-shadow', `box-shadow ${dur} ${cssEasing}`);
    root.style.setProperty('--transition-transform', `transform ${dur} ${cssEasing}`);
    root.style.setProperty('--transition-opacity', `opacity ${dur} ${cssEasing}`);
    root.style.setProperty('--transition-all', `all ${dur} ${cssEasing}`);
  }, []);

  const applyMotionDuration = useCallback((ms: number) => {
    const root = document.documentElement;
    root.style.setProperty('--duration-instant', '0ms');
    root.style.setProperty('--duration-fast', `${Math.round(ms * 0.5)}ms`);
    root.style.setProperty('--duration-normal', `${ms}ms`);
    root.style.setProperty('--duration-slow', `${Math.round(ms * 1.5)}ms`);
    root.style.setProperty('--duration-slower', `${Math.round(ms * 2.5)}ms`);
    const easingVal = getCSSVar('--ease-default') || 'ease';
    root.style.setProperty(
      '--transition-colors',
      `color ${ms}ms ${easingVal}, background-color ${ms}ms ${easingVal}, border-color ${ms}ms ${easingVal}`,
    );
    root.style.setProperty('--transition-shadow', `box-shadow ${ms}ms ${easingVal}`);
    root.style.setProperty('--transition-transform', `transform ${ms}ms ${easingVal}`);
    root.style.setProperty('--transition-opacity', `opacity ${ms}ms ${easingVal}`);
    root.style.setProperty('--transition-all', `all ${ms}ms ${easingVal}`);
  }, []);

  // ── Event handlers ────────────────────────────────────────────────────────

  const handlePresetSelect = (preset: ThemePreset) => {
    applyPreset(preset);
    onPresetChange(preset.id);
    setModifiedVars(new Set());
    setModifiedScalars(new Set());
    undoRedo.clear();
  };

  const handleColorChange = (varName: string, value: string) => {
    const oldValue = tokenValues[varName] ?? '';
    setTokenValues((prev) => ({ ...prev, [varName]: value }));
    document.documentElement.style.setProperty(varName, value);
    setModifiedVars((prev) => new Set([...prev, varName]));
    undoRedo.push({ varName, oldValue, newValue: value });
    showUndoToast(varName);
  };

  const resetColorToken = (varName: string) => {
    // Remove inline style to revert to theme CSS var
    document.documentElement.style.removeProperty(varName);
    const computed = getCSSVar(varName);
    setTokenValues((prev) => ({ ...prev, [varName]: computed }));
    setModifiedVars((prev) => {
      const next = new Set(prev);
      next.delete(varName);
      return next;
    });
  };

  const resetColorSection = (sectionId: string) => {
    const section = COLOR_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;
    for (const token of section.tokens) {
      document.documentElement.style.removeProperty(token.var);
    }
    refreshValues();
    setModifiedVars((prev) => {
      const next = new Set(prev);
      for (const token of section.tokens) next.delete(token.var);
      return next;
    });
  };

  const handleRadiusChange = (value: number) => {
    const oldValue = radius;
    setRadius(value);
    for (const step of RADIUS_SCALE) {
      const px = Math.round(value * step.ratio);
      document.documentElement.style.setProperty(step.var, `${px}px`);
    }
    document.documentElement.style.setProperty('--radius-full', '9999px');
    setModifiedScalars((prev) => new Set([...prev, 'radius']));
    undoRedo.push({ varName: '--radius-md', oldValue: `${oldValue}px`, newValue: `${value}px` });
  };

  const handleDisplayFontChange = (stack: string) => {
    setDisplayFont(stack);
    document.documentElement.style.setProperty('--font-family-display', stack);
    setModifiedScalars((prev) => new Set([...prev, 'displayFont']));
  };

  const handleBodyFontChange = (stack: string) => {
    setBodyFont(stack);
    document.documentElement.style.setProperty('--font-family-body', stack);
    setModifiedScalars((prev) => new Set([...prev, 'bodyFont']));
  };

  const handleMonoFontChange = (stack: string) => {
    setMonoFont(stack);
    document.documentElement.style.setProperty('--font-family-mono', stack);
    setModifiedScalars((prev) => new Set([...prev, 'monoFont']));
  };

  const handleTypeSizeChange = (value: number) => {
    setTypeBaseSize(value);
    applyTypeScale(value, typeRatio);
    setModifiedScalars((prev) => new Set([...prev, 'typeScale']));
  };

  const handleTypeRatioChange = (value: number) => {
    setTypeRatio(value);
    applyTypeScale(typeBaseSize, value);
    setModifiedScalars((prev) => new Set([...prev, 'typeScale']));
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    document.documentElement.style.setProperty('--line-height-normal', String(value));
    setModifiedScalars((prev) => new Set([...prev, 'lineHeight']));
  };

  const handleSpacingBaseChange = (value: number) => {
    setSpacingBase(value);
    applySpacingScale(value);
    setModifiedScalars((prev) => new Set([...prev, 'spacing']));
  };

  const handleDensityChange = (mode: DensityMode) => {
    setDensity(mode);
    if (mode === 'default') {
      document.documentElement.removeAttribute('data-density');
    } else {
      document.documentElement.setAttribute('data-density', mode);
    }
    setModifiedScalars((prev) => new Set([...prev, 'density']));
  };

  const handleScaleChange = (value: number) => {
    setScale(value);
    const preview = document.getElementById('preview-area');
    if (preview) preview.style.zoom = String(value);
    document.documentElement.style.setProperty('--arcana-scale', String(value));
  };

  const handleMotionDurationChange = (ms: number) => {
    setMotionDuration(ms);
    applyMotionDuration(ms);
    setModifiedScalars((prev) => new Set([...prev, 'motion']));
  };

  const handleBezierChange = (values: BezierValues, cssString: string) => {
    setBezier(values);
    applyMotionEasing(cssString);
    setModifiedScalars((prev) => new Set([...prev, 'motion']));
  };

  const handleLocalFontEntryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const newFont: LocalFontEntry = { name: fontName, stack: `'${fontName}', sans-serif` };
    setLocalFontEntrys((prev) => [...prev, newFont]);
    setPendingFont(newFont);
    e.target.value = '';
  };

  const applyFontToTarget = (target: 'display' | 'body' | 'mono') => {
    if (!pendingFont) return;
    if (target === 'display') handleDisplayFontChange(pendingFont.stack);
    else if (target === 'body') handleBodyFontChange(pendingFont.stack);
    else handleMonoFontChange(pendingFont.stack);
    setPendingFont(null);
  };

  // ── Undo/Redo ─────────────────────────────────────────────────────────────

  const showUndoToast = (varName: string) => {
    setUndoToast(`Changed ${varName}`);
    clearTimeout(undoToastTimer.current);
    undoToastTimer.current = setTimeout(() => setUndoToast(null), 3000);
  };

  const performUndo = useCallback(() => {
    const entry = undoRedo.undo();
    if (!entry) return;
    document.documentElement.style.setProperty(entry.varName, entry.oldValue);
    setTokenValues((prev) => ({ ...prev, [entry.varName]: entry.oldValue }));
  }, [undoRedo]);

  const performRedo = useCallback(() => {
    const entry = undoRedo.redo();
    if (!entry) return;
    document.documentElement.style.setProperty(entry.varName, entry.newValue);
    setTokenValues((prev) => ({ ...prev, [entry.varName]: entry.newValue }));
  }, [undoRedo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        performUndo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        performRedo();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [performUndo, performRedo]);

  // ── Full reset ────────────────────────────────────────────────────────────

  const handleReset = () => {
    const lightPreset = PRESETS.find((p) => p.id === 'light');
    if (lightPreset) applyPreset(lightPreset);
    onPresetChange('light');
    setTypeBaseSize(16);
    setTypeRatio(1.25);
    setLineHeight(1.5);
    setSpacingBase(4);
    setDensity('default');
    setScale(1);
    setMotionDuration(200);
    setBezier({ x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 });
    setModifiedVars(new Set());
    setModifiedScalars(new Set());
    undoRedo.clear();
    document.documentElement.removeAttribute('data-density');
    for (const v of [
      '--duration-instant',
      '--duration-fast',
      '--duration-normal',
      '--duration-slow',
      '--duration-slower',
      '--ease-default',
      '--ease-in',
      '--ease-out',
      '--ease-in-out',
      '--transition-colors',
      '--transition-shadow',
      '--transition-transform',
      '--transition-opacity',
      '--transition-all',
    ]) {
      document.documentElement.style.removeProperty(v);
    }
    setDisplayFont("'Playfair Display', serif");
    setBodyFont('Inter, system-ui, -apple-system, sans-serif');
    setMonoFont("'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace");
    for (const step of TYPE_SCALE_STEPS) document.documentElement.style.removeProperty(step.cssVar);
    for (const step of ALL_SPACING_STEPS)
      document.documentElement.style.removeProperty(step.cssVar);
    for (const v of RADIUS_SCALE) document.documentElement.style.removeProperty(v.var);
    document.documentElement.style.removeProperty('--radius-full');
    document.documentElement.style.removeProperty('--line-height-normal');
    document.documentElement.style.removeProperty('--font-family-display');
    document.documentElement.style.removeProperty('--font-family-body');
    document.documentElement.style.removeProperty('--font-family-mono');
    document.documentElement.style.removeProperty('--arcana-scale');
    const preview = document.getElementById('preview-area');
    if (preview) preview.style.zoom = '';
  };

  // ── Export/Import ─────────────────────────────────────────────────────────

  const collectTokenSnapshot = useCallback((): Record<string, string> => {
    const exportObj: Record<string, string> = {};
    for (const varName of ALL_COLOR_VARS) {
      exportObj[varName] = getCSSVar(varName);
    }
    for (const step of RADIUS_SCALE) {
      exportObj[step.var] = `${Math.round(radius * step.ratio)}px`;
    }
    exportObj['--radius-full'] = '9999px';
    exportObj['--arcana-scale'] = String(scale);
    exportObj['--font-family-display'] = displayFont;
    exportObj['--font-family-body'] = bodyFont;
    exportObj['--font-family-mono'] = monoFont;
    exportObj['--line-height-normal'] = String(lineHeight);
    for (const step of TYPE_SCALE_STEPS) exportObj[step.cssVar] = getCSSVar(step.cssVar);
    for (const step of ALL_SPACING_STEPS) exportObj[step.cssVar] = getCSSVar(step.cssVar);
    exportObj['--duration-normal'] = `${motionDuration}ms`;
    exportObj['--ease-default'] = getCSSVar('--ease-default') || 'ease';
    exportObj['--data-density'] = density;
    return exportObj;
  }, [radius, scale, displayFont, bodyFont, monoFont, lineHeight, motionDuration, density]);

  const handleExport = () => {
    const exportObj = collectTokenSnapshot();
    const json = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcana-theme-${activePresetId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Record<string, string>;
        const root = document.documentElement;
        for (const [varName, value] of Object.entries(data)) {
          if (varName === '--data-density') {
            if (value === 'compact' || value === 'comfortable') {
              root.setAttribute('data-density', value);
              setDensity(value);
            } else {
              root.removeAttribute('data-density');
              setDensity('default');
            }
            continue;
          }
          if (varName.startsWith('--')) root.style.setProperty(varName, value);
        }
        if (data['--font-family-display']) setDisplayFont(data['--font-family-display']);
        if (data['--font-family-body']) setBodyFont(data['--font-family-body']);
        if (data['--font-family-mono']) setMonoFont(data['--font-family-mono']);
        if (data['--line-height-normal'])
          setLineHeight(Number.parseFloat(data['--line-height-normal']) || 1.5);
        if (data['--font-size-base']) {
          let px = Number.parseFloat(data['--font-size-base']);
          if (data['--font-size-base'].includes('rem')) px = px * 16;
          setTypeBaseSize(Math.round(px) || 16);
        }
        if (data['--spacing-1'])
          setSpacingBase(Math.round(Number.parseFloat(data['--spacing-1'])) || 4);
        if (data['--radius-md']) setRadius(Number.parseInt(data['--radius-md']) || 8);
        if (data['--arcana-scale']) {
          const s = Number.parseFloat(data['--arcana-scale']);
          if (s > 0) {
            setScale(s);
            const preview = document.getElementById('preview-area');
            if (preview) preview.style.zoom = String(s);
          }
        }
        if (data['--duration-normal']) {
          const ms = Number.parseInt(data['--duration-normal']);
          if (!Number.isNaN(ms)) setMotionDuration(ms);
        }
        refreshValues();
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Section toggles ───────────────────────────────────────────────────────

  const toggleSection = (name: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleColorGroup = (id: string) => {
    setOpenColorGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Search filtering ──────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase();

  const filteredColorSections = useMemo(() => {
    if (!q) return COLOR_SECTIONS;
    return COLOR_SECTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.tokens.some((t) => t.label.toLowerCase().includes(q) || t.var.toLowerCase().includes(q)),
    ).map((s) => ({
      ...s,
      tokens: s.tokens.filter(
        (t) =>
          !q ||
          s.label.toLowerCase().includes(q) ||
          t.label.toLowerCase().includes(q) ||
          t.var.toLowerCase().includes(q),
      ),
    }));
  }, [q]);

  const showTypography =
    !q || 'typography fonts family display body mono weight size scale'.includes(q);
  const showSpacing = !q || 'spacing density compact comfortable'.includes(q);
  const showShape = !q || 'shape radius border rounded'.includes(q);
  const showMotion = !q || 'motion animation duration easing bezier spring bounce'.includes(q);
  const showScale = !q || 'scale zoom preview'.includes(q);

  // ── Modified counts ───────────────────────────────────────────────────────

  const colorModifiedCount = modifiedVars.size;
  const typographyModifiedCount = [
    'displayFont',
    'bodyFont',
    'monoFont',
    'typeScale',
    'lineHeight',
  ].filter((k) => modifiedScalars.has(k)).length;
  const spacingModifiedCount = ['spacing', 'density'].filter((k) => modifiedScalars.has(k)).length;
  const shapeModifiedCount = modifiedScalars.has('radius') ? 1 : 0;
  const motionModifiedCount = modifiedScalars.has('motion') ? 1 : 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.editor}>
      {/* ── Header ── */}
      <div className={styles.editorHeader}>
        <span className={styles.editorTitle}>Token Editor</span>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.undoBtn}
            onClick={performUndo}
            disabled={!undoRedo.canUndo}
            title="Undo (⌘Z)"
          >
            ↩
          </button>
          <button
            type="button"
            className={styles.undoBtn}
            onClick={performRedo}
            disabled={!undoRedo.canRedo}
            title="Redo (⌘⇧Z)"
          >
            ↪
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <Input
          size="sm"
          placeholder="Search tokens…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<span aria-hidden="true">⌕</span>}
          suffix={
            searchQuery ? (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            ) : undefined
          }
        />
      </div>

      {/* ── 1. Theme Presets ── */}
      {(!q || 'theme preset'.includes(q)) && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('presets')}
          >
            <span className={styles.sectionToggle}>{openSections.has('presets') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>Theme Presets</span>
          </button>
          {openSections.has('presets') && (
            <div className={styles.presetGrid}>
              {PRESETS.map((preset) => (
                <button
                  type="button"
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
      )}

      {/* ── 2. Colors ── */}
      {filteredColorSections.length > 0 && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('colors')}
          >
            <span className={styles.sectionToggle}>{openSections.has('colors') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>Colors</span>
            {colorModifiedCount > 0 && (
              <span className={styles.modifiedBadge}>{colorModifiedCount}</span>
            )}
          </button>
          {openSections.has('colors') && (
            <div className={styles.subSections}>
              {filteredColorSections.map((group) => {
                const sectionModified = group.tokens.filter((t) => modifiedVars.has(t.var)).length;
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      className={styles.groupHeader}
                      onClick={() => toggleColorGroup(group.id)}
                    >
                      <span className={styles.groupToggle}>
                        {openColorGroups.has(group.id) ? '▾' : '▸'}
                      </span>
                      <span className={styles.groupLabel}>{group.label}</span>
                      {sectionModified > 0 && (
                        <span
                          className={styles.groupModifiedDot}
                          title={`${sectionModified} modified`}
                        />
                      )}
                      {openColorGroups.has(group.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={styles.sectionResetBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            resetColorSection(group.id);
                          }}
                          title={`Reset ${group.label}`}
                        >
                          Reset
                        </Button>
                      )}
                    </button>
                    {openColorGroups.has(group.id) && (
                      <div className={styles.tokenList}>
                        {group.tokens.map((token) => {
                          const currentVal = tokenValues[token.var] ?? '#000000';
                          const isModified = modifiedVars.has(token.var);
                          return (
                            <div key={token.var} className={styles.tokenRow}>
                              {isModified && (
                                <span className={styles.modifiedDot} title="Modified" />
                              )}
                              <span className={styles.tokenLabel}>{token.label}</span>
                              <div className={styles.tokenInputs}>
                                <ColorPicker
                                  value={currentVal}
                                  onChange={(v) => handleColorChange(token.var, v)}
                                  presetColors={themePalette}
                                />
                                <span className={styles.colorValue}>
                                  {toHex(currentVal).toUpperCase()}
                                </span>
                                {isModified && (
                                  <button
                                    type="button"
                                    className={styles.tokenResetBtn}
                                    onClick={() => resetColorToken(token.var)}
                                    title="Reset to preset default"
                                  >
                                    ↺
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 3. Typography ── */}
      {showTypography && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('typography')}
          >
            <span className={styles.sectionToggle}>
              {openSections.has('typography') ? '▾' : '▸'}
            </span>
            <span className={styles.sectionLabel}>Typography</span>
            {typographyModifiedCount > 0 && (
              <span className={styles.modifiedBadge}>{typographyModifiedCount}</span>
            )}
          </button>
          {openSections.has('typography') && (
            <div className={styles.sectionBody}>
              {/* Font Families */}
              <p className={styles.subSectionLabel}>Font Families</p>
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
              <p className={styles.subSectionLabel}>Size Scale</p>
              <div className={styles.sliderRow}>
                <label htmlFor="type-base-size" className={styles.tokenLabel}>
                  Base Size
                </label>
                <div className={styles.sliderControl}>
                  <input
                    id="type-base-size"
                    type="range"
                    className={styles.slider}
                    min={12}
                    max={24}
                    step={0.5}
                    value={typeBaseSize}
                    onChange={(e) => handleTypeSizeChange(Number.parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    className={styles.sliderNumberInput}
                    min={12}
                    max={24}
                    step={0.5}
                    value={typeBaseSize}
                    onChange={(e) => handleTypeSizeChange(Number.parseFloat(e.target.value))}
                    aria-label="Base font size in pixels"
                  />
                  <span className={styles.sliderUnit}>px</span>
                </div>
              </div>
              <div className={styles.tokenRow}>
                <label htmlFor="type-ratio" className={styles.tokenLabel}>
                  Scale Ratio
                </label>
                <select
                  id="type-ratio"
                  className={styles.fontSelect}
                  value={String(typeRatio)}
                  onChange={(e) => handleTypeRatioChange(Number.parseFloat(e.target.value))}
                >
                  {TYPE_SCALE_RATIOS.map((r) => (
                    <option key={r.value} value={String(r.value)}>
                      {r.label}
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
              <p className={styles.subSectionLabel}>Line Height</p>
              <div className={styles.sliderRow}>
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
                  <input
                    type="number"
                    className={styles.sliderNumberInput}
                    min={1.0}
                    max={2.0}
                    step={0.05}
                    value={lineHeight.toFixed(2)}
                    onChange={(e) => handleLineHeightChange(Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Font Upload */}
              <p className={styles.subSectionLabel}>Upload Font</p>
              <div className={styles.localFontUpload}>
                <label className={styles.localFontLabel}>
                  <span className={styles.localFontLabelText}>↑ Choose file</span>
                  <span className={styles.localFontHint}>.woff2 .woff .ttf .otf</span>
                  <input
                    type="file"
                    accept=".woff2,.woff,.ttf,.otf"
                    className={styles.localFontInput}
                    onChange={handleLocalFontEntryUpload}
                  />
                </label>
                {pendingFont && (
                  <div className={styles.fontTargetSelector}>
                    <div className={styles.fontTargetHeader}>
                      Apply{' '}
                      <strong style={{ fontFamily: pendingFont.stack }}>{pendingFont.name}</strong>{' '}
                      to:
                    </div>
                    <div className={styles.fontTargetPreview}>
                      <button
                        type="button"
                        className={styles.fontTargetBtn}
                        onClick={() => applyFontToTarget('display')}
                      >
                        <span className={styles.fontTargetLabel}>Display</span>
                        <span
                          className={styles.fontTargetSample}
                          style={{
                            fontFamily: pendingFont.stack,
                            fontSize: '18px',
                            fontWeight: 600,
                          }}
                        >
                          Headlines
                        </span>
                      </button>
                      <button
                        type="button"
                        className={styles.fontTargetBtn}
                        onClick={() => applyFontToTarget('body')}
                      >
                        <span className={styles.fontTargetLabel}>Body</span>
                        <span
                          className={styles.fontTargetSample}
                          style={{ fontFamily: pendingFont.stack, fontSize: '13px' }}
                        >
                          Body text and paragraphs
                        </span>
                      </button>
                      <button
                        type="button"
                        className={styles.fontTargetBtn}
                        onClick={() => applyFontToTarget('mono')}
                      >
                        <span className={styles.fontTargetLabel}>Mono</span>
                        <span
                          className={styles.fontTargetSample}
                          style={{ fontFamily: pendingFont.stack, fontSize: '12px' }}
                        >
                          {'const code = true;'}
                        </span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.fontTargetDismiss}
                      onClick={() => setPendingFont(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
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
      )}

      {/* ── 4. Spacing ── */}
      {showSpacing && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('spacing')}
          >
            <span className={styles.sectionToggle}>{openSections.has('spacing') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>Spacing</span>
            {spacingModifiedCount > 0 && (
              <span className={styles.modifiedBadge}>{spacingModifiedCount}</span>
            )}
          </button>
          {openSections.has('spacing') && (
            <div className={styles.sectionBody}>
              {/* Density */}
              <p className={styles.subSectionLabel}>Density Mode</p>
              <div className={styles.segmentedControl}>
                {(['compact', 'default', 'comfortable'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={`${styles.segmentBtn} ${density === mode ? styles.segmentActive : ''}`}
                    onClick={() => handleDensityChange(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Base unit */}
              <p className={styles.subSectionLabel}>Base Unit</p>
              <div className={styles.sliderRow}>
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
                  <input
                    type="number"
                    className={styles.sliderNumberInput}
                    min={2}
                    max={8}
                    step={0.5}
                    value={spacingBase}
                    onChange={(e) => handleSpacingBaseChange(Number.parseFloat(e.target.value))}
                  />
                  <span className={styles.sliderUnit}>px</span>
                </div>
              </div>

              {/* Visual scale */}
              <div className={styles.spacingPreview}>
                {SPACING_PREVIEW_STEPS.map((step) => {
                  const px = step.multiplier * spacingBase;
                  return (
                    <div key={step.label} className={styles.spacingRow}>
                      <span className={styles.spacingLabel}>{step.label}</span>
                      <div className={styles.spacingTrack}>
                        <div
                          className={styles.spacingBlock}
                          style={{ width: `${Math.min(px, 96)}px` }}
                        />
                      </div>
                      <span className={styles.spacingValue}>{px}px</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 5. Shape ── */}
      {showShape && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('shape')}
          >
            <span className={styles.sectionToggle}>{openSections.has('shape') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>Shape</span>
            {shapeModifiedCount > 0 && (
              <span className={styles.modifiedBadge}>{shapeModifiedCount}</span>
            )}
          </button>
          {openSections.has('shape') && (
            <div className={styles.sectionBody}>
              <p className={styles.subSectionLabel}>Border Radius</p>
              <div className={styles.sliderRow}>
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
                  <input
                    type="number"
                    className={styles.sliderNumberInput}
                    min={0}
                    max={24}
                    step={1}
                    value={radius}
                    onChange={(e) => handleRadiusChange(Number.parseInt(e.target.value))}
                  />
                  <span className={styles.sliderUnit}>px</span>
                </div>
              </div>
              {/* Radius preview shapes */}
              <div className={styles.radiusPreview}>
                {[0, 4, 8, 12, 16, 24].map((r) => (
                  <div
                    key={r}
                    className={styles.radiusShape}
                    style={{ borderRadius: `${r}px` }}
                    title={`${r}px`}
                  />
                ))}
              </div>
              {/* Active radius indicator */}
              <div className={styles.radiusActive}>
                <div className={styles.radiusActiveShape} style={{ borderRadius: `${radius}px` }} />
                <span className={styles.radiusActiveLabel}>{radius}px — md radius</span>
              </div>

              {/* Scale */}
              <p className={styles.subSectionLabel}>Preview Scale</p>
              <div className={styles.sliderRow}>
                <div className={styles.sliderControl}>
                  <input
                    type="range"
                    className={styles.slider}
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={scale}
                    onChange={(e) => handleScaleChange(Number.parseFloat(e.target.value))}
                  />
                  <span className={styles.sliderValueDisplay}>{Math.round(scale * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 6. Motion ── */}
      {showMotion && (
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => toggleSection('motion')}
          >
            <span className={styles.sectionToggle}>{openSections.has('motion') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>Motion</span>
            {motionModifiedCount > 0 && (
              <span className={styles.modifiedBadge}>{motionModifiedCount}</span>
            )}
          </button>
          {openSections.has('motion') && (
            <div className={styles.sectionBody}>
              {/* Duration presets */}
              <p className={styles.subSectionLabel}>Duration</p>
              <div className={styles.segmentedControl}>
                {[
                  { label: 'Instant', value: 0 },
                  { label: 'Snappy', value: 100 },
                  { label: 'Default', value: 200 },
                  { label: 'Smooth', value: 300 },
                  { label: 'Dramatic', value: 500 },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    className={`${styles.segmentBtn} ${motionDuration === preset.value ? styles.segmentActive : ''}`}
                    onClick={() => handleMotionDurationChange(preset.value)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className={styles.sliderRow}>
                <div className={styles.sliderControl}>
                  <input
                    type="range"
                    className={styles.slider}
                    min={0}
                    max={1000}
                    step={10}
                    value={motionDuration}
                    onChange={(e) => handleMotionDurationChange(Number.parseInt(e.target.value))}
                  />
                  <input
                    type="number"
                    className={styles.sliderNumberInput}
                    min={0}
                    max={1000}
                    step={10}
                    value={motionDuration}
                    onChange={(e) => handleMotionDurationChange(Number.parseInt(e.target.value))}
                  />
                  <span className={styles.sliderUnit}>ms</span>
                </div>
              </div>

              {/* Bezier editor */}
              <p className={styles.subSectionLabel}>Easing Curve</p>
              <CubicBezierEditor values={bezier} onChange={handleBezierChange} />
            </div>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={handleReset}>
          Reset All
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => importInputRef.current?.click()}
        >
          Import
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={handleExport}
        >
          Export
        </button>
      </div>

      {/* ── Undo toast ── */}
      {undoToast && (
        <div className={styles.undoToast}>
          <span>{undoToast}</span>
          <button type="button" className={styles.undoToastBtn} onClick={performUndo}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import './ThemeSwitcher.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeSwitcherProps {
  /** Initial theme to select */
  defaultTheme?: string;
  /** Initial density to select */
  defaultDensity?: 'compact' | 'default' | 'comfortable';
}

interface CustomTheme {
  name: string;
  css: string;
}

// ─── Preset list ──────────────────────────────────────────────────────────────

const PRESETS = [
  'light',
  'dark',
  'terminal',
  'retro98',
  'glass',
  'brutalist',
  'corporate',
  'startup',
  'editorial',
  'commerce',
  'midnight',
  'nature',
  'neon',
  'mono',
] as const;

const DENSITIES = ['compact', 'default', 'comfortable'] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function applyDensity(density: string): void {
  if (density === 'default') {
    document.documentElement.removeAttribute('data-density');
  } else {
    document.documentElement.setAttribute('data-density', density);
  }
}

function injectCustomCSS(id: string, css: string): void {
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function removeCustomCSS(id: string): void {
  const style = document.getElementById(id);
  if (style) style.remove();
}

/**
 * Converts a token JSON preset to inline CSS custom properties.
 * Handles the three-tier hierarchy: primitive → semantic → component.
 */
function tokenJSONToCSS(json: Record<string, unknown>, themeName: string): string {
  const vars: string[] = [];

  function flatten(obj: Record<string, unknown>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'string') {
        // Resolve references like {primitive.color.blue.500}
        const resolved = value.replace(/\{([^}]+)\}/g, (_match, ref: string) => {
          const parts = ref.split('.');
          let target: unknown = json;
          for (const part of parts) {
            if (target && typeof target === 'object') {
              target = (target as Record<string, unknown>)[part];
            } else {
              return value;
            }
          }
          return typeof target === 'string' ? target : value;
        });
        vars.push(`  --${path}: ${resolved};`);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // DensityValue objects have compact/default/comfortable keys
        const obj = value as Record<string, unknown>;
        if (
          'default' in obj &&
          typeof obj.default === 'string' &&
          ('compact' in obj || 'comfortable' in obj)
        ) {
          // Use default value for the base theme
          const resolved = (obj.default as string).replace(
            /\{([^}]+)\}/g,
            (_match, ref: string) => {
              const parts = ref.split('.');
              let target: unknown = json;
              for (const part of parts) {
                if (target && typeof target === 'object') {
                  target = (target as Record<string, unknown>)[part];
                } else {
                  return obj.default as string;
                }
              }
              return typeof target === 'string' ? target : (obj.default as string);
            },
          );
          vars.push(`  --${path}: ${resolved};`);
        } else {
          flatten(obj, path);
        }
      }
    }
  }

  // Process semantic tokens (the layer components reference)
  if (json.semantic && typeof json.semantic === 'object') {
    flatten(json.semantic as Record<string, unknown>, '');
  }

  // Process component tokens
  if (json.component && typeof json.component === 'object') {
    flatten(json.component as Record<string, unknown>, '');
  }

  return `[data-theme="${themeName}"] {\n${vars.join('\n')}\n}`;
}

/**
 * Validates basic structure of a token JSON file.
 * Returns null on success or an error message string.
 */
function validateTokenJSON(json: unknown): string | null {
  if (!json || typeof json !== 'object') return 'Invalid JSON: expected an object';
  const obj = json as Record<string, unknown>;
  if (!obj.name || typeof obj.name !== 'string') return 'Missing required field: name';
  if (!obj.primitive || typeof obj.primitive !== 'object')
    return 'Missing required field: primitive';
  if (!obj.semantic || typeof obj.semantic !== 'object') return 'Missing required field: semantic';
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ThemeSwitcher({
  defaultTheme = 'light',
  defaultDensity = 'default',
}: ThemeSwitcherProps): React.JSX.Element {
  const [theme, setTheme] = useState(defaultTheme);
  const [density, setDensity] = useState<string>(defaultDensity);
  const [collapsed, setCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore custom theme from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('arcana-custom-theme');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CustomTheme;
        setCustomTheme(parsed);
        injectCustomCSS('arcana-custom-theme', parsed.css);
      } catch {
        // ignore invalid stored data
      }
    }
  }, []);

  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply density on change
  useEffect(() => {
    applyDensity(density);
  }, [density]);

  const handleThemeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === '_custom' && customTheme) {
        setTheme(customTheme.name);
      } else {
        setTheme(val);
      }
    },
    [customTheme],
  );

  const handleDensityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setDensity(e.target.value);
  }, []);

  const processFile = useCallback((file: File) => {
    setUploadError(null);
    if (!file.name.endsWith('.json')) {
      setUploadError('File must be a .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as Record<string, unknown>;
        const validationError = validateTokenJSON(json);
        if (validationError) {
          setUploadError(validationError);
          return;
        }

        const name = (json.name as string).replace(/^arcana-/, '');
        const css = tokenJSONToCSS(json, name);
        const custom: CustomTheme = { name, css };

        injectCustomCSS('arcana-custom-theme', css);
        sessionStorage.setItem('arcana-custom-theme', JSON.stringify(custom));
        setCustomTheme(custom);
        setTheme(name);
        setShowUpload(false);
      } catch {
        setUploadError('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleRemoveCustom = useCallback(() => {
    removeCustomCSS('arcana-custom-theme');
    sessionStorage.removeItem('arcana-custom-theme');
    setCustomTheme(null);
    setTheme('light');
    setShowUpload(false);
  }, []);

  if (collapsed) {
    return (
      <button
        className="arcana-theme-switcher-toggle"
        onClick={() => setCollapsed(false)}
        aria-label="Show theme switcher"
        type="button"
      >
        Theme
      </button>
    );
  }

  return (
    <div className="arcana-theme-switcher" role="toolbar" aria-label="Theme switcher">
      <div className="arcana-theme-switcher__controls">
        <label className="arcana-theme-switcher__label">
          Theme
          <select
            className="arcana-theme-switcher__select"
            value={customTheme && theme === customTheme.name ? '_custom' : theme}
            onChange={handleThemeChange}
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
            {customTheme && <option value="_custom">{customTheme.name} (custom)</option>}
          </select>
        </label>

        <label className="arcana-theme-switcher__label">
          Density
          <select
            className="arcana-theme-switcher__select"
            value={density}
            onChange={handleDensityChange}
          >
            {DENSITIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <button
          className="arcana-theme-switcher__btn"
          onClick={() => setShowUpload(!showUpload)}
          type="button"
        >
          Upload JSON
        </button>

        {customTheme && (
          <button
            className="arcana-theme-switcher__btn arcana-theme-switcher__btn--remove"
            onClick={handleRemoveCustom}
            type="button"
          >
            Remove Custom
          </button>
        )}

        <button
          className="arcana-theme-switcher__btn arcana-theme-switcher__btn--collapse"
          onClick={() => setCollapsed(true)}
          type="button"
          aria-label="Minimize theme switcher"
        >
          —
        </button>
      </div>

      {showUpload && (
        <div className="arcana-theme-switcher__upload">
          <div
            className={`arcana-theme-switcher__dropzone${dragOver ? ' arcana-theme-switcher__dropzone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
          >
            <p>Drop a theme JSON file here, or click to browse</p>
            <p className="arcana-theme-switcher__hint">
              Must contain name, primitive, and semantic fields
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          {uploadError && (
            <p className="arcana-theme-switcher__error" role="alert">
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

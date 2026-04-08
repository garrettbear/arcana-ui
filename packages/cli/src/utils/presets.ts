/**
 * Canonical list of Arcana theme presets. Kept here (rather than read from
 * @arcana-ui/tokens at runtime) so the CLI can enumerate them before the
 * tokens package is installed — critical for the `init` flow, which runs
 * before any install.
 */
export interface Preset {
  id: string;
  label: string;
  description: string;
}

export const PRESETS: Preset[] = [
  { id: 'light', label: 'Light', description: 'Warm, clean, professional (default)' },
  { id: 'dark', label: 'Dark', description: 'Deep, focused, modern' },
  { id: 'terminal', label: 'Terminal', description: 'Green phosphor, hacker aesthetic' },
  { id: 'retro98', label: 'Retro 98', description: 'Windows 98 nostalgia' },
  { id: 'glass', label: 'Glass', description: 'Translucent, Apple-inspired' },
  { id: 'brutalist', label: 'Brutalist', description: 'Raw, bold, high contrast' },
  { id: 'corporate', label: 'Corporate', description: 'Conservative, trustworthy' },
  { id: 'startup', label: 'Startup', description: 'Vibrant, energetic' },
  { id: 'editorial', label: 'Editorial', description: 'Elegant serif, publishing' },
  { id: 'commerce', label: 'Commerce', description: 'Clean, product-focused' },
  { id: 'midnight', label: 'Midnight', description: 'Deep navy, soft gold' },
  { id: 'nature', label: 'Nature', description: 'Earth tones, organic' },
  { id: 'neon', label: 'Neon', description: 'Electric, vivid' },
  { id: 'mono', label: 'Mono', description: 'Black and white, typographic' },
];

export const PRESET_IDS = PRESETS.map((p) => p.id);

export function isValidPreset(id: string): boolean {
  return PRESET_IDS.includes(id);
}

/** Current published beta dist-tag used by the CLI when pinning dependencies. */
export const ARCANA_CORE_VERSION = '^0.1.0-beta.2';
export const ARCANA_TOKENS_VERSION = '^0.1.0-beta.2';

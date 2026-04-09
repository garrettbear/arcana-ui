import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import manifest from '../data/manifest.json' with { type: 'json' };

interface ThemeEntry {
  id: string;
  name?: string;
  description?: string;
}

interface ManifestData {
  tokens?: {
    themes?: ThemeEntry[];
  };
}

const typedManifest = manifest as ManifestData;

// Preset metadata that enriches the manifest's theme list
const PRESET_META: Record<
  string,
  { bestFor: string; mode: 'light' | 'dark'; density: string; personality: string[] }
> = {
  light: {
    bestFor: 'General apps, productivity tools, documentation sites',
    mode: 'light',
    density: 'normal',
    personality: ['clean', 'precise', 'professional', 'readable'],
  },
  dark: {
    bestFor: 'Developer tools, code editors, dashboards, night-mode apps',
    mode: 'dark',
    density: 'normal',
    personality: ['focused', 'rich', 'modern', 'developer-friendly'],
  },
  midnight: {
    bestFor: 'Finance apps, trading platforms, premium SaaS, investor dashboards',
    mode: 'dark',
    density: 'normal',
    personality: ['premium', 'sophisticated', 'trustworthy', 'elegant'],
  },
  corporate: {
    bestFor: 'Enterprise software, B2B tools, compliance dashboards, intranet apps',
    mode: 'light',
    density: 'compact',
    personality: ['trustworthy', 'professional', 'structured', 'conservative'],
  },
  startup: {
    bestFor: 'Modern SaaS, growth tools, landing pages, marketing sites',
    mode: 'light',
    density: 'normal',
    personality: ['energetic', 'bold', 'gradient', 'conversion-focused'],
  },
  editorial: {
    bestFor: 'Blogs, news sites, content platforms, documentation',
    mode: 'light',
    density: 'comfortable',
    personality: ['typographic', 'readable', 'authoritative', 'timeless'],
  },
  commerce: {
    bestFor: 'E-commerce stores, marketplaces, product showcases',
    mode: 'light',
    density: 'normal',
    personality: ['friendly', 'trustworthy', 'product-focused', 'conversion-ready'],
  },
  glass: {
    bestFor: 'Mobile apps, design portfolios, creative showcases',
    mode: 'light',
    density: 'comfortable',
    personality: ['translucent', 'elegant', 'modern', 'Apple-inspired'],
  },
  brutalist: {
    bestFor: 'Creative agencies, design portfolios, experimental sites',
    mode: 'dark',
    density: 'normal',
    personality: ['bold', 'raw', 'structural', 'typographic'],
  },
  terminal: {
    bestFor: 'CLI tools, developer portals, hacker-aesthetic apps',
    mode: 'dark',
    density: 'compact',
    personality: ['monospace', 'retro', 'technical', 'no-nonsense'],
  },
  retro98: {
    bestFor: 'Nostalgia apps, game sites, retro-aesthetic products',
    mode: 'light',
    density: 'compact',
    personality: ['nostalgic', 'beveled', 'quirky', 'pixel-perfect'],
  },
  nature: {
    bestFor: 'Wellness apps, sustainability platforms, organic brands',
    mode: 'light',
    density: 'comfortable',
    personality: ['organic', 'calming', 'earthy', 'sustainable'],
  },
  neon: {
    bestFor: 'Gaming sites, entertainment apps, creative tools',
    mode: 'dark',
    density: 'normal',
    personality: ['vibrant', 'electric', 'cyberpunk', 'attention-grabbing'],
  },
  mono: {
    bestFor: 'Architecture portfolios, typography-focused sites, minimalist apps',
    mode: 'light',
    density: 'comfortable',
    personality: ['minimal', 'typographic', 'timeless', 'stark'],
  },
};

export function registerListPresets(server: McpServer): void {
  server.tool(
    'list_presets',
    'List all 14 available Arcana UI theme presets with descriptions, best-use categories, and personality keywords. Use get_preset to retrieve the full token JSON for a specific preset.',
    {},
    async () => {
      const themes = typedManifest.tokens?.themes ?? [];

      const result = themes.map((theme) => {
        const meta = PRESET_META[theme.id] ?? {
          bestFor: 'General use',
          mode: 'light' as const,
          density: 'normal',
          personality: [],
        };

        return {
          name: theme.id,
          description: theme.description ?? '',
          bestFor: meta.bestFor,
          mode: meta.mode,
          density: meta.density,
          personality: meta.personality,
          switchCode: `document.documentElement.setAttribute('data-theme', '${theme.id}')`,
        };
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: result.length,
                presets: result,
                usage:
                  "Set data-theme attribute on <html>: document.documentElement.setAttribute('data-theme', 'midnight')",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Static imports — bundled by tsup so the package is fully self-contained
import brutalist from '../data/presets/brutalist.json' with { type: 'json' };
import commerce from '../data/presets/commerce.json' with { type: 'json' };
import corporate from '../data/presets/corporate.json' with { type: 'json' };
import dark from '../data/presets/dark.json' with { type: 'json' };
import editorial from '../data/presets/editorial.json' with { type: 'json' };
import glass from '../data/presets/glass.json' with { type: 'json' };
import light from '../data/presets/light.json' with { type: 'json' };
import midnight from '../data/presets/midnight.json' with { type: 'json' };
import mono from '../data/presets/mono.json' with { type: 'json' };
import nature from '../data/presets/nature.json' with { type: 'json' };
import neon from '../data/presets/neon.json' with { type: 'json' };
import retro98 from '../data/presets/retro98.json' with { type: 'json' };
import startup from '../data/presets/startup.json' with { type: 'json' };
import terminal from '../data/presets/terminal.json' with { type: 'json' };

const PRESETS: Record<string, Record<string, unknown>> = {
  brutalist: brutalist as Record<string, unknown>,
  commerce: commerce as Record<string, unknown>,
  corporate: corporate as Record<string, unknown>,
  dark: dark as Record<string, unknown>,
  editorial: editorial as Record<string, unknown>,
  glass: glass as Record<string, unknown>,
  light: light as Record<string, unknown>,
  midnight: midnight as Record<string, unknown>,
  mono: mono as Record<string, unknown>,
  nature: nature as Record<string, unknown>,
  neon: neon as Record<string, unknown>,
  retro98: retro98 as Record<string, unknown>,
  startup: startup as Record<string, unknown>,
  terminal: terminal as Record<string, unknown>,
};

export function registerGetPreset(server: McpServer): void {
  server.tool(
    'get_preset',
    'Get the complete JSON configuration for a specific Arcana UI theme preset, including all primitive, semantic, and component tokens. Use list_presets to see all available presets.',
    {
      name: z
        .string()
        .describe(
          `Preset name (case-insensitive). Valid values: ${Object.keys(PRESETS).join(', ')}`,
        ),
    },
    async ({ name }) => {
      const normalized = name.toLowerCase().trim();
      const preset = PRESETS[normalized];

      if (!preset) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: `Preset "${name}" not found`,
                  available: Object.keys(PRESETS),
                  hint: 'Use list_presets to see all presets with descriptions',
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                name: normalized,
                preset,
                usage: {
                  apply: `document.documentElement.setAttribute('data-theme', '${normalized}')`,
                  css: `import '@arcana-ui/tokens/dist/arcana.css';`,
                  customization:
                    'Override any token in your CSS: :root { --color-action-primary: #ff6600; }',
                },
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

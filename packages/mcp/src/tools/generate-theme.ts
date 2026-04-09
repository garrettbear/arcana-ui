import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerGenerateTheme(server: McpServer): void {
  server.tool(
    'generate_theme',
    'Generate a complete Arcana UI theme preset from a brand description. Requires an Anthropic API key (ANTHROPIC_API_KEY env var). Without it, returns instructions for using the playground instead.',
    {
      description: z
        .string()
        .describe(
          'Brand/site description to generate a theme from. Examples: "fintech dashboard, navy and gold, professional", "gaming site, neon cyberpunk, dark", "wellness app, earthy greens, calming"',
        ),
      siteType: z
        .string()
        .optional()
        .describe('Type of site. Examples: dashboard, marketing, ecommerce, editorial, portfolio'),
      density: z
        .enum(['compact', 'normal', 'comfortable'])
        .optional()
        .describe('Layout density preference'),
    },
    async ({ description, siteType, density }) => {
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: 'ANTHROPIC_API_KEY not configured',
                  message:
                    'AI theme generation requires an Anthropic API key. Set ANTHROPIC_API_KEY in your environment, or use the interactive playground instead.',
                  alternatives: {
                    playground: 'https://arcana-ui.dev — AI theme generation with visual preview',
                    manual:
                      'Use get_preset to download an existing preset, then customize the tokens to match your brand',
                    starter:
                      'Try a close preset first: midnight (finance), corporate (enterprise), startup (modern SaaS), editorial (content), nature (wellness)',
                  },
                  requestedConfig: { description, siteType, density },
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      // API key is present — call Anthropic to generate a theme
      // This uses the same generation pipeline as the playground (Sprint P.5)
      try {
        const systemPrompt = `You are an expert UI designer specializing in design systems and CSS custom properties.
Generate a complete Arcana UI theme preset JSON based on the user's brand description.

The JSON must follow this exact structure:
{
  "name": "theme-id",
  "description": "One-line description",
  "primitive": {
    "color": {
      "brand": { "50": "#hex", "100": "#hex", ..., "900": "#hex" },
      "neutral": { "50": "#hex", ..., "900": "#hex" },
      "accent": { "50": "#hex", ..., "900": "#hex" }
    },
    "font": {
      "display": "Font Name, sans-serif",
      "body": "Font Name, sans-serif",
      "mono": "Monospace Font, monospace"
    }
  },
  "semantic": {
    "color": {
      "background": {
        "default": "{primitive.color.neutral.50}",
        "surface": "{primitive.color.neutral.100}",
        "elevated": "{primitive.color.neutral.0}"
      },
      "foreground": {
        "primary": "{primitive.color.neutral.900}",
        "secondary": "{primitive.color.neutral.600}",
        "muted": "{primitive.color.neutral.400}"
      },
      "action": {
        "primary": "{primitive.color.brand.500}",
        "primaryHover": "{primitive.color.brand.600}"
      },
      "border": {
        "default": "{primitive.color.neutral.200}"
      }
    }
  },
  "component": {}
}

Return ONLY valid JSON. No explanation text.`;

        const userPrompt = `Generate a theme for: ${description}${siteType ? `\nSite type: ${siteType}` : ''}${density ? `\nDensity: ${density}` : ''}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status}`);
        }

        const data = (await response.json()) as {
          content: Array<{ type: string; text: string }>;
        };
        const text = data.content.find((c) => c.type === 'text')?.text ?? '';

        // Extract JSON from response
        const jsonMatch = /\{[\s\S]*\}/.exec(text);
        if (!jsonMatch) throw new Error('No valid JSON in response');

        const generated = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  success: true,
                  theme: generated,
                  usage: {
                    validate: 'Use validate_theme to check this theme for errors',
                    apply: `document.documentElement.setAttribute('data-theme', '${String(generated.name ?? 'custom')}')`,
                    customize: 'Save as a preset JSON file and import in your arcana.css build',
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: 'Theme generation failed',
                  message: err instanceof Error ? err.message : String(err),
                  fallback:
                    'Use get_preset to start from an existing preset and customize the tokens manually',
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}

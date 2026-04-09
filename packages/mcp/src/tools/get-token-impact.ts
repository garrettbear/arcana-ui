import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import tokenMap from '../data/token-map.json' with { type: 'json' };

interface TokenEntry {
  tier: string;
  category: string;
  usedBy: Array<{
    component: string;
    property?: string;
    via?: string;
    direct?: boolean;
  }>;
}

interface TokenMapData {
  tokenToComponents?: Record<string, TokenEntry>;
  tokenCount?: number;
  componentCount?: number;
}

const typedTokenMap = tokenMap as TokenMapData;

export function registerGetTokenImpact(server: McpServer): void {
  server.tool(
    'get_token_impact',
    'Get all Arcana UI components affected by a specific design token. Use this to understand the blast radius of changing a token value. Works with component tokens (--button-bg), semantic tokens (--color-bg-surface), and primitive tokens (--primitive-blue-500).',
    {
      token: z
        .string()
        .describe(
          'Token name including the -- prefix. Examples: --color-bg-surface, --radius-md, --color-action-primary, --button-bg',
        ),
    },
    async ({ token }) => {
      const tokenData = typedTokenMap.tokenToComponents;
      if (!tokenData) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ error: 'Token map data not available' }, null, 2),
            },
          ],
        };
      }

      // Try exact match first
      let entry = tokenData[token];

      // Try case-insensitive match if exact fails
      if (!entry) {
        const lower = token.toLowerCase();
        const key = Object.keys(tokenData).find((k) => k.toLowerCase() === lower);
        if (key) entry = tokenData[key];
      }

      if (!entry) {
        // Suggest similar tokens
        const similar = Object.keys(tokenData)
          .filter((k) => k.toLowerCase().includes(token.replace(/^--/, '').toLowerCase()))
          .slice(0, 8);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: `Token "${token}" not found in token map`,
                  similar: similar.length > 0 ? similar : undefined,
                  hint: 'Token names must include the -- prefix (e.g., --color-bg-surface)',
                  stats: {
                    totalTokens: typedTokenMap.tokenCount ?? Object.keys(tokenData).length,
                    totalComponents: typedTokenMap.componentCount ?? 0,
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      const affectedComponents = entry.usedBy.map((u) => ({
        component: u.component,
        cssProperty: u.property ?? null,
        via: u.via ?? null,
        direct: u.direct ?? !u.via,
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                token,
                tier: entry.tier,
                category: entry.category,
                affectedComponentCount: affectedComponents.length,
                usedBy: affectedComponents,
                note:
                  entry.tier === 'primitive'
                    ? 'Primitive tokens are rarely used directly — consider changing the semantic token instead'
                    : entry.tier === 'semantic'
                      ? 'Semantic tokens are used by multiple components — changing this will affect all listed components'
                      : 'Component token change is scoped to this component only',
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

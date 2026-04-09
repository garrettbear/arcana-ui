import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import manifest from '../data/manifest.json' with { type: 'json' };
import tokenMap from '../data/token-map.json' with { type: 'json' };

interface PropDef {
  type?: string;
  values?: string[];
  default?: unknown;
  description?: string;
  required?: boolean;
}

interface ComponentEntry {
  name: string;
  category: string;
  description?: string;
  import?: string;
  props?: Record<string, PropDef>;
  examples?: string[];
  accessibility?: Record<string, unknown>;
  subComponents?: string[];
  tokens?: string[];
}

interface ManifestData {
  components?: ComponentEntry[];
}

interface TokenMapData {
  componentToTokens?: Record<
    string,
    {
      componentTokens: Array<{ name: string; fallback: string | null }>;
      semanticTokens: Array<{ name: string }>;
    }
  >;
}

const typedManifest = manifest as ManifestData;
const typedTokenMap = tokenMap as TokenMapData;

export function registerGetComponent(server: McpServer): void {
  server.tool(
    'get_component',
    'Get full documentation for a specific Arcana UI component including props table, usage examples, component tokens, accessibility notes, and sub-components.',
    {
      name: z
        .string()
        .describe('Component name (case-insensitive). Examples: Button, DataTable, Hero, Navbar'),
    },
    async ({ name }) => {
      const components = typedManifest.components ?? [];
      const component = components.find((c) => c.name.toLowerCase() === name.toLowerCase());

      if (!component) {
        const similar = components
          .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
          .map((c) => c.name)
          .slice(0, 5);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: `Component "${name}" not found`,
                  similar: similar.length > 0 ? similar : undefined,
                  hint: 'Use list_components to see all available components',
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      // Enrich with token data
      const compKey = component.name
        .replace(/([A-Z])/g, (_m, c, i) => (i > 0 ? `-${c}` : c))
        .toLowerCase()
        .replace(/^-/, '');
      const compTokenData = typedTokenMap.componentToTokens?.[compKey];

      // Build props table
      const propsTable = component.props
        ? Object.entries(component.props).map(([propName, def]) => ({
            name: propName,
            type: def.values
              ? def.values.map((v) => `'${v}'`).join(' | ')
              : (def.type ?? 'unknown'),
            default: def.default !== undefined ? String(def.default) : undefined,
            required: def.required ?? false,
            description: def.description ?? '',
          }))
        : [];

      const result = {
        name: component.name,
        category: component.category,
        description: component.description ?? '',
        import: component.import ?? `import { ${component.name} } from '@arcana-ui/core'`,
        props: propsTable,
        examples: component.examples ?? [],
        accessibility: component.accessibility ?? {},
        subComponents: component.subComponents ?? [],
        tokens: {
          component: compTokenData?.componentTokens ?? [],
          semantic: compTokenData?.semanticTokens ?? [],
        },
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}

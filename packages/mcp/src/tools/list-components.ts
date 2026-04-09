import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import manifest from '../data/manifest.json' with { type: 'json' };

interface ComponentEntry {
  name: string;
  category: string;
  description?: string;
  import?: string;
  props?: Record<string, unknown>;
  subComponents?: string[];
}

interface ManifestData {
  components?: ComponentEntry[];
}

const typedManifest = manifest as ManifestData;

export function registerListComponents(server: McpServer): void {
  server.tool(
    'list_components',
    'List all Arcana UI components with names, categories, and descriptions. Optionally filter by category (primitives, composites, patterns, layout, other).',
    {
      category: z
        .string()
        .optional()
        .describe(
          'Filter by category. Valid values: primitives, composites, patterns, layout, other',
        ),
    },
    async ({ category }) => {
      const components = typedManifest.components ?? [];

      const filtered = category
        ? components.filter((c) => c.category.toLowerCase() === category.toLowerCase())
        : components;

      const result = filtered.map((c) => ({
        name: c.name,
        category: c.category,
        description: c.description ?? null,
        propsCount: c.props ? Object.keys(c.props).length : 0,
        hasSubComponents: Array.isArray(c.subComponents) && c.subComponents.length > 0,
        import: c.import ?? `import { ${c.name} } from '@arcana-ui/core'`,
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: result.length,
                filtered: !!category,
                category: category ?? 'all',
                components: result,
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

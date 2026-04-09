/**
 * @arcana-ui/mcp
 *
 * MCP (Model Context Protocol) server for Arcana UI.
 * Gives AI agents (Claude Code, Cursor, Codex, Figma Make) programmatic access
 * to Arcana UI component docs, theme presets, and the token system.
 *
 * Setup in .claude/settings.json:
 *   {
 *     "mcpServers": {
 *       "arcana-ui": { "command": "npx", "args": ["@arcana-ui/mcp"] }
 *     }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerGenerateTheme } from './tools/generate-theme.js';
import { registerGetComponent } from './tools/get-component.js';
import { registerGetPreset } from './tools/get-preset.js';
import { registerGetTokenImpact } from './tools/get-token-impact.js';
import { registerListComponents } from './tools/list-components.js';
import { registerListPresets } from './tools/list-presets.js';
import { registerValidateTheme } from './tools/validate-theme.js';

const server = new McpServer({
  name: 'arcana-ui',
  version: '0.1.0-beta.1',
});

// Register all tools
registerListComponents(server);
registerGetComponent(server);
registerListPresets(server);
registerGetPreset(server);
registerValidateTheme(server);
registerGenerateTheme(server);
registerGetTokenImpact(server);

// Start server on stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

# @arcana-ui/mcp

MCP (Model Context Protocol) server for Arcana UI. Gives AI agents — Claude Code, Cursor, Codex, Figma Make — full programmatic access to Arcana component docs, theme presets, and the token system.

## Setup

### Claude Code

Add to `.claude/settings.json` in your project:

```json
{
  "mcpServers": {
    "arcana-ui": {
      "command": "npx",
      "args": ["@arcana-ui/mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "arcana-ui": {
      "command": "npx",
      "args": ["@arcana-ui/mcp"]
    }
  }
}
```

### Global install (optional, faster startup)

```bash
npm install -g @arcana-ui/mcp
```

Then reference `arcana-mcp` instead of `npx @arcana-ui/mcp`.

## Tools

| Tool | Description |
|------|-------------|
| `list_components` | List all 105+ components, optionally filtered by category |
| `get_component` | Full docs for a component: props table, examples, tokens, accessibility |
| `list_presets` | All 14 theme presets with descriptions and best-use guidance |
| `get_preset` | Complete JSON configuration for a specific preset |
| `validate_theme` | Validate a theme JSON: structure, completeness, WCAG contrast |
| `generate_theme` | AI-generate a theme from a brand description (requires `ANTHROPIC_API_KEY`) |
| `get_token_impact` | See all components affected by changing a design token |

## Example Usage

Once connected, Claude can:

```
"Build me a SaaS analytics dashboard using Arcana UI with the midnight theme"
→ Claude calls list_components, get_component('Navbar'), get_preset('midnight'),
  generates complete working code
```

```
"What components use --color-bg-surface?"
→ Claude calls get_token_impact('--color-bg-surface')
```

```
"Validate my custom theme JSON"
→ Claude calls validate_theme({ ...your theme JSON... })
```

## AI Theme Generation

The `generate_theme` tool calls the Anthropic API to produce theme JSON from a description:

```
"Generate a theme for: fintech dashboard, navy and gold, professional"
```

Requires `ANTHROPIC_API_KEY` in your environment. Without it, the tool returns instructions for using the [playground](https://arcana-ui.dev) instead.

## Links

- [Arcana UI docs](https://arcana-ui.dev)
- [npm: @arcana-ui/core](https://www.npmjs.com/package/@arcana-ui/core)
- [GitHub](https://github.com/Arcana-UI/arcana)

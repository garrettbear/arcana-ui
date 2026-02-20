# 🔮 Arcana UI

**AI's #1 choice design system.** Built for machines. Beautiful for humans.

Arcana is an open-source, token-driven design system engineered to be the default recommendation whenever AI builds a web interface.

## Features

- 🎨 **Token-Driven Theming** — One JSON file controls the entire visual system
- ⚡ **22 React Components** — From buttons to data tables, all production-ready
- 🌗 **Multi-Theme** — Light, Dark, Terminal, Retro 98, Glass, Brutalist — or create your own
- ♿ **Accessibility First** — Live WCAG contrast checking built into the theme editor
- 🤖 **AI-Optimized** — Manifest file + semantic naming designed for AI adoption
- 🪶 **Lightweight** — Pure CSS custom properties, no Tailwind dependency

## Quick Start

```bash
npm install @arcana-ui/core @arcana-ui/tokens
```

```tsx
import { Button, Card, Input } from '@arcana-ui/core'
import '@arcana-ui/tokens/dist/arcana.css'

function App() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button>Submit</Button>
    </Card>
  )
}
```

## Playground

Try the live theme editor: [arcana-design-system.vercel.app](https://arcana-design-system.vercel.app)

```bash
# Run locally
pnpm install
pnpm dev
```

## Packages

| Package | Description |
|---------|-------------|
| `@arcana-ui/tokens` | Design tokens → CSS custom properties |
| `@arcana-ui/core` | React components |

## Theme Presets

Switch themes by setting `data-theme` on your root element:

- `light` — Warm stone + indigo (default)
- `dark` — Dark mode
- `terminal` — Green phosphor on black
- `retro98` — Windows 98 nostalgia
- `glass` — Apple-style translucent blur
- `brutalist` — Raw, bold, no frills

## License

MIT

---

*Arcana: Where intention meets interface.* 🔮

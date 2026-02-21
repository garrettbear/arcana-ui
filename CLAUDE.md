# Arcana UI — Current Build Tasks

## Context
- 8 component tests exist (Button, Input, Textarea, Checkbox, Radio, Select, Badge, Toggle)
- Token editor + accessibility panel exist in playground
- No typography/spacing editors yet
- No docs site yet

## Task 1: Remaining Component Tests
Write tests for these 14 components (same pattern as existing tests — render, props, axe a11y):
Avatar, AvatarGroup, Card, Modal, Alert, Toast, Tabs, Accordion, Stack, HStack, Grid, Container, Navbar, EmptyState, Form, Table

Each .test.tsx goes next to its component. All must pass `toHaveNoViolations()`.

## Task 2: Typography System in Playground

### Google Fonts Picker
- Hardcode a curated list of 30+ popular Google Fonts (don't need API — just the font names and load via Google Fonts CSS URL)
- Searchable dropdown component
- When selected, inject a <link> tag to load the font, then update the CSS variable

### Multiple Font Slots in Token Editor
Add 3 font pickers to the Token Editor sidebar:
- Display Font (--arcana-font-display) — for headings
- Body Font (--arcana-font-body) — for UI text
- Mono Font (--arcana-font-mono) — for code

### Type Scale Editor
- Base size slider (12-24px, default 16)
- Scale ratio dropdown: Minor Second 1.067, Major Second 1.125, Minor Third 1.200, Major Third 1.250, Perfect Fourth 1.333, Augmented Fourth 1.414, Perfect Fifth 1.500, Golden Ratio 1.618
- Live preview showing computed sizes for h1-h6, body, small
- Updates --arcana-font-size-* CSS variables in real-time
- Line height slider (1.0-2.0)

### Spacing Scale Editor  
- Base unit slider (2-8px, default 4)
- Preview blocks showing all spacing values visually
- Updates --arcana-spacing-* CSS variables

### Local Font Upload
- File input accepting .woff2, .woff, .ttf, .otf
- Register uploaded font via @font-face + URL.createObjectURL
- Make it appear in the font picker dropdowns

### Token Editor Organization
Group the token editor into collapsible sections:
1. Colors (existing color pickers)
2. Typography (new — fonts, type scale, line height)
3. Spacing (new — spacing scale)
4. Effects (existing — radius, shadows)
5. Theme Presets (existing — light, dark, terminal, etc.)

## Task 3: Docs Site with Fumadocs

Set up a docs site in /docs using Fumadocs (Next.js):

```bash
npx create-fumadocs-app docs
```

### Structure
docs/
├── app/
├── content/docs/
│   ├── index.mdx              (Getting Started)
│   ├── installation.mdx       (Install + setup)
│   ├── theming.mdx            (Token system, theme switching, customization)
│   ├── accessibility.mdx      (A11y features, WCAG compliance)
│   ├── ai-integration.mdx     (manifest.ai.json, llms.txt, MCP)
│   ├── components/
│   │   ├── button.mdx
│   │   ├── input.mdx
│   │   ├── ... (one page per component)
│   └── playground.mdx         (Link to live playground)

### Design Direction
- Clean, warm, Anthropic-inspired aesthetic
- Warm white backgrounds, stone neutrals, indigo accents
- Use Inter font
- Subtle, confident, not flashy

### SEO Requirements
- Proper meta tags on every page (title, description, og:image)
- Structured data (JSON-LD) for software application
- Sitemap.xml generation
- robots.txt
- OpenGraph images
- Canonical URLs
- Fast load times (Fumadocs handles this)

### AI Discoverability
- Create /llms.txt at root — plain text summary of what Arcana is, components list, install instructions
- Create /llms-full.txt — detailed version with all component props
- Ensure manifest.ai.json is served at a public URL
- Add <meta name="ai-content-description"> tags

### Each Component Doc Page Should Have
- Description + when to use
- Import statement
- Props table
- Live examples (use code blocks — we'll add live preview later)
- Accessibility notes
- Related components

## Quality Bar
- pnpm build must pass across all packages
- pnpm test must pass
- Docs site must build (pnpm --filter docs build)
- Commit and push when done

When completely finished, run this command to notify me:
openclaw system event --text "Done: Remaining tests, typography system, spacing editor, and Fumadocs site built for Arcana" --mode now

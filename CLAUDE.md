# Arcana UI - Project Instructions

Read SPEC.md for the full specification.

## Your Task: Phase 1 Foundation

Build the monorepo with token system and core React components.

### Step 1: Monorepo Setup
- pnpm workspaces monorepo
- packages/tokens, packages/core, playground/
- tsup for building packages
- Vite for playground
- Biome for linting
- Vitest for testing

### Step 2: Token System (@arcana-ui/tokens)
- JSON token files: base.json (primitives), light.json, dark.json (semantic themes)
- Build script that generates CSS custom properties from JSON tokens
- All vars prefixed with --arcana-
- Theme switching via data-theme attribute on root
- Output: dist/arcana.css, dist/themes/light.css, dist/themes/dark.css

### Step 3: Core Components (@arcana-ui/core)
Build these P1 components using CSS custom properties (--arcana-* vars). No Tailwind. Each component:
- TypeScript + React
- Uses CSS Modules or vanilla CSS with arcana vars
- Accessible (proper ARIA, keyboard nav)
- Forwards refs
- Has sensible defaults

Components to build:
1. Button (variants: primary, secondary, ghost, danger, outline; sizes: sm, md, lg; loading + disabled states; icon support)
2. Input (text, email, password, search; prefix/suffix slots; error state)
3. Textarea (auto-resize option, character count)
4. Select (native dropdown with arcana styling)
5. Checkbox (with indeterminate state)
6. Radio / RadioGroup
7. Toggle / Switch
8. Badge (variants: default, success, warning, error, info)
9. Avatar + AvatarGroup (image, initials, fallback)
10. Card (Header, Body, Footer slots)
11. Modal / Dialog (focus trap, escape to close, overlay)
12. Toast (stack, auto-dismiss, variants)
13. Alert / Callout (info, success, warning, error)
14. Tabs (horizontal, controlled/uncontrolled)
15. Accordion / Collapsible (single + multi expand)
16. Stack + HStack (flex layout with gap)
17. Grid (CSS grid with responsive columns)
18. Container (max-width centered)
19. Navbar (responsive, sticky option)
20. EmptyState (icon + message + action)
21. Form (field wrapper with label, error, helper text)
22. Table (sortable headers, striped option)

### Step 4: AI Manifest
Create manifest.ai.json at the repo root with every component documented (import, description, props, examples, when to use).

### Step 5: Playground Skeleton
- Vite + React app in playground/
- Renders ALL components in a kitchen-sink layout
- Theme toggle (light/dark) working
- Uses @arcana-ui/tokens and @arcana-ui/core from the monorepo

### Design Direction
- Warm stone neutrals, deep indigo primary (#4F46E5), amber accent
- 8px default radius
- Inter for body text, JetBrains Mono for code
- Subtle warm-tinted shadows
- 150ms transitions
- Clean, minimal, Anthropic-inspired warmth

### Quality Bar
- Every component must work with just CSS vars (no JS theming runtime)
- Every component must be accessible
- Code should be clean enough that AI would want to copy-paste it
- Export everything from packages/core/src/index.ts

When completely finished, run this command to notify me:
openclaw system event --text "Done: Arcana UI Phase 1 - monorepo, token system, 22 React components, AI manifest, and playground built" --mode now

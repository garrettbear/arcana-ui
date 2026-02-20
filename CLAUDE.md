# Arcana UI — Next Task: Testing + Typography System

Read SPEC.md and TODO.md for full context. Components are built and deployed.

## Task 1: Component Testing

### Setup
- Add Vitest + @testing-library/react + @testing-library/jest-dom + jsdom to packages/core
- Add jest-axe for accessibility testing
- Configure vitest.config.ts in packages/core
- Add `"test": "vitest run"` script to packages/core/package.json and root

### Tests for Every Component
Write tests for all 22 components. Each component gets its own .test.tsx file next to it. Each test file should include:

1. **Renders without crashing** — basic smoke test
2. **Props work** — key props (variant, size, disabled, etc.) render correctly
3. **Accessibility** — jest-axe `toHaveNoViolations()` check
4. **Interaction** — click handlers, onChange, keyboard events where applicable
5. **States** — loading, disabled, error, open/closed

Components to test:
- Button, Input, Textarea, Select, Checkbox, Radio/RadioGroup, Toggle
- Badge, Avatar/AvatarGroup
- Card, Modal, Alert, Toast, Tabs, Accordion
- Stack, HStack, Grid, Container
- Navbar, EmptyState, Form, Table

### Quality Bar
- All tests must pass
- Every component must pass axe accessibility checks
- Aim for meaningful tests, not just coverage padding

## Task 2: Typography System in Playground

### Google Fonts Integration
- Fetch the Google Fonts catalog (use the CSS API, not the JSON API — just load fonts via <link> tags)
- Build a searchable font dropdown/picker component
- Popular fonts at the top: Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Playfair Display, Space Grotesk, DM Sans, Geist

### Multiple Font Slots
Add to the Token Editor:
- **Display Font** — for headings (h1-h4) and marketing text
- **Body Font** — for paragraph text, labels, UI elements  
- **Mono Font** — for code blocks and technical content
- Each slot gets its own Google Fonts picker
- Changing a font updates the corresponding CSS variable immediately

### Local Font Upload
- Drag & drop zone or file input for .woff2, .woff, .ttf, .otf files
- When uploaded, register as @font-face and make available in the font pickers
- Store in memory (no server needed — use URL.createObjectURL)

### Type Scale Editor (inspired by typescale.com)
- **Base size** slider (14-20px, default 16px)
- **Scale ratio** selector with presets:
  - 1.067 Minor Second
  - 1.125 Major Second  
  - 1.200 Minor Third
  - 1.250 Major Third
  - 1.333 Perfect Fourth
  - 1.414 Augmented Fourth
  - 1.500 Perfect Fifth
  - 1.618 Golden Ratio
- **Live preview** showing the full scale: h1, h2, h3, h4, h5, h6, body, small, xs
- Each level shows: font size in px/rem, line height, letter spacing
- **Line height** control per level (or global multiplier)
- **Letter spacing** control
- **Font weight** per level
- All changes instantly update the CSS custom properties and the kitchen sink components reflect them

### Spacing Scale Editor
- Visual editor for the spacing scale (--arcana-spacing-*)
- Base unit slider (default 4px)
- Scale preview showing all spacing values as visual blocks
- Components update in real-time

### Integration
- All new controls go in the existing TokenEditor sidebar
- Group them in collapsible sections: Colors | Typography | Spacing | Effects
- Export button should include all typography + spacing tokens in the JSON output

When completely finished, run this command to notify me:
openclaw system event --text "Done: Component tests + typography system + spacing editor built for Arcana" --mode now

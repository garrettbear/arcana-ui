# Arcana UI - Phase 1.5: Playground + Accessibility

Read SPEC.md for full context. Phase 1 components are built and working.

## Your Task: Make the Playground the "Oh Shit" Moment

### 1. Token Editor Panel (LEFT SIDEBAR)
Build a live token editor that updates CSS custom properties in real-time:

- **Color pickers** for all semantic tokens (surface, action, text, border, feedback colors)
- **Sliders** for: border-radius scale, spacing scale, shadow intensity, font size scale
- **Font family selector** (dropdown with web-safe + popular Google fonts)
- **Preset buttons**: Light, Dark, Terminal (green on black), Retro 98 (Windows 98 look), Glass (Apple-style blur/transparency), Brutalist (harsh, raw)
- Changing ANY token instantly updates all components on the page (just update CSS custom properties on :root)
- "Reset to Default" button
- "Export Theme" button that downloads the current tokens as JSON

### 2. Accessibility Panel (RIGHT SIDEBAR or BOTTOM PANEL)
Live accessibility testing that runs on every token change:

- **Contrast Checker**: For every text/background combination in the current theme, show WCAG AA and AAA pass/fail. Show the actual contrast ratio (e.g., "4.5:1 ✅ AA / ❌ AAA"). Color code: green = pass both, yellow = AA only, red = fail.
- **Color Blindness Simulator**: CSS filter toggles to preview the entire page through protanopia, deuteranopia, tritanopia, achromatopsia. Dropdown or button group to switch.
- **Auto-Fix Suggestions**: When a contrast check fails, suggest the nearest passing color with a one-click "Apply Fix" button.
- **A11y Score Card**: Overall theme grade (AAA / AA / Fail) with breakdown of passing/failing combinations.

### 3. Improve the Kitchen Sink Layout
The current App.tsx shows all components but make it look like a real dashboard/app:
- Header with Navbar
- Sidebar navigation
- Main content area with sections for each component category
- Make it look like something someone would actually build — not just a component dump
- Show realistic data in tables, forms, cards

### 4. Theme Presets
Create these preset themes as JSON files in packages/tokens/src/presets/:
- light.json (default - warm stone + indigo)
- dark.json (dark mode)
- terminal.json (green phosphor on black, monospace everything, no radius)
- retro98.json (Windows 98: gray backgrounds, 2px outset borders, system fonts, square corners)
- glass.json (translucent surfaces, blur backdrops, thin borders, large radius)
- brutalist.json (black/white, thick borders, no radius, no shadows, bold type)

Each preset is a complete semantic token set that overrides the defaults.

### Technical Notes
- Token editor should modify CSS custom properties directly on document.documentElement.style
- Use simple state management (React useState/useReducer) — no external state libs
- Contrast ratio calculation: use the WCAG relative luminance formula (built-in, no external lib needed)
- Color blindness filters: use CSS `filter` with SVG color matrices
- Keep it all in the playground/ package
- Must build with `pnpm build` when done

### Quality Bar
- The playground should make someone say "oh shit this is cool" when they toggle between Windows 98 and Glass mode
- Accessibility panel should feel integrated, not bolted on
- Responsive — works on desktop (mobile is a nice-to-have)
- Fast — token changes should feel instant

When completely finished, run this command to notify me:
openclaw system event --text "Done: Arcana playground with token editor, 6 theme presets, and accessibility panel built" --mode now

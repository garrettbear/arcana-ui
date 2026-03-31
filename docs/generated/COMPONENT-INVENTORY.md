> **Auto-generated file.** Do not edit manually.
> Source: `scripts/generate-docs.mjs`
> Regenerate: `pnpm generate-docs`
> Last generated: 2026-03-31T04:53:17.732Z

# Component Inventory

Total components: **105**

## Primitives (12)

| Component | Variants | Sizes | Sub-components |
|-----------|----------|-------|----------------|
| Avatar | — | xs, sm, md, lg, xl | AvatarGroup |
| AvatarGroup | — | — | — |
| Badge | default, success, warning, error, info, secondary | sm, md, lg | — |
| Button | primary, secondary, ghost, destructive, outline | sm, md, lg | — |
| Checkbox | — | — | CheckboxGroup |
| CheckboxGroup | — | — | — |
| Input | — | sm, md, lg | — |
| Radio | — | — | RadioGroup |
| RadioGroup | default, card | — | — |
| Select | — | sm, md, lg | — |
| Textarea | — | — | — |
| Toggle | — | sm, md, lg | — |

## Composites (20)

| Component | Variants | Sizes | Sub-components |
|-----------|----------|-------|----------------|
| Accordion | — | — | AccordionItem, AccordionTrigger, AccordionContent |
| AccordionContent | — | — | — |
| AccordionTrigger | — | — | — |
| Alert | info, success, warning, error | — | — |
| Banner | info, success, warning, error, neutral | — | — |
| Card | default, outlined, elevated | — | CardHeader, CardBody, CardFooter |
| CardBody | — | — | — |
| CardFooter | — | — | — |
| CardHeader | — | — | — |
| ErrorBoundary | — | — | — |
| Modal | — | sm, md, lg, xl, full | ModalClose |
| ModalClose | — | — | — |
| Skeleton | text, circular, rectangular | — | — |
| Spinner | — | xs, sm, md, lg, xl | — |
| Tab | — | — | Tabs, TabList, TabPanels, TabPanel, Table, TableHeader, TableBody, TableRow, TableHead, TableCell |
| TabList | — | — | — |
| TabPanel | — | — | TabPanels |
| TabPanels | — | — | — |
| Tabs | line, pills | — | — |
| ToastProvider | — | — | — |

## Layout (5)

| Component | Variants | Sizes | Sub-components |
|-----------|----------|-------|----------------|
| Container | — | — | ContainerSize, ContainerPadding |
| Grid | — | — | GridColumn |
| GridColumn | — | — | — |
| HStack | — | — | — |
| Stack | — | — | — |

## Patterns (64)

| Component | Variants | Sizes | Sub-components |
|-----------|----------|-------|----------------|
| ArticleLayout | — | — | — |
| AspectRatio | — | — | — |
| AuthorCard | inline, card | — | — |
| BottomSheet | — | — | — |
| Breadcrumb | — | — | BreadcrumbItem |
| Carousel | — | — | — |
| Collapsible | — | — | — |
| CommandPalette | — | — | — |
| CopyButton | default, ghost, icon | sm, md | — |
| CTA | banner, card, minimal | — | CTAAction |
| DataTable | — | — | — |
| DatePicker | — | sm, md, lg | — |
| Divider | solid, dashed, dotted | — | — |
| Drawer | — | sm, md, lg, full | DrawerNav |
| DrawerNav | — | — | — |
| FeatureSection | grid, list, alternating | — | — |
| FileUpload | dropzone, button | — | — |
| Footer | standard, minimal | — | FooterSection, FooterLink, FooterBottom |
| FooterBottom | — | — | — |
| FooterLink | — | — | — |
| FooterSection | — | — | — |
| Form | — | — | FormField, FormLabel, FormHelperText, FormErrorMessage |
| FormErrorMessage | — | — | — |
| FormField | — | — | — |
| FormHelperText | — | — | — |
| FormLabel | — | — | — |
| Hero | centered, split, fullscreen | — | HeroCTAAction |
| Image | — | — | — |
| KeyboardShortcut | default, inline | — | — |
| KPICard | default, compact | — | — |
| LogoCloud | grid, marquee, fade | — | — |
| MobileNav | — | — | MobileNavItem |
| Navbar | — | — | NavbarBrand, NavbarContent, NavbarActions |
| NavbarActions | — | — | — |
| NavbarBrand | — | — | — |
| NavbarContent | — | — | — |
| NewsletterSignup | inline, card, banner | — | — |
| Pagination | default, compact | — | PaginationConfig |
| Popover | — | — | — |
| PriceDisplay | — | sm, md, lg, xl | — |
| PricingCard | default, compact | — | — |
| ProductCard | default, compact, horizontal | — | — |
| ProgressBar | default, striped, animated | sm, md, lg | — |
| PullQuote | default, accent, large | — | — |
| QuantitySelector | — | sm, md | — |
| RatingStars | — | sm, md, lg | — |
| RelatedPosts | card, list | — | — |
| ScrollArea | — | — | — |
| Sidebar | — | — | SidebarHeader, SidebarContent, SidebarFooter, SidebarItem, SidebarSection |
| SidebarContent | — | — | — |
| SidebarFooter | — | — | — |
| SidebarHeader | — | — | — |
| SidebarSection | — | — | — |
| Spacer | — | xs, sm, md, lg, xl, 2xl, 3xl, section | — |
| StatCard | default, compact | — | — |
| StatsBar | inline, card | — | — |
| Table | — | sm, md, lg | TableHeader, TableBody, TableRow, TableHead, TableCell |
| TableBody | — | — | — |
| TableCell | — | — | — |
| TableHead | — | — | TableHeader |
| TableHeader | — | — | — |
| TableRow | — | — | — |
| Testimonial | card, inline, featured | — | — |
| Timeline | standard, compact, alternating | — | TimelineItemData |

## Other (4)

| Component | Variants | Sizes | Sub-components |
|-----------|----------|-------|----------------|
| ColorPicker | — | sm, md, lg | — |
| FontPicker | — | sm, md, lg | — |
| rgbaToHex | — | — | — |
| ThemeProvider | — | — | — |

## Hooks (11)

| Hook | Description |
|------|-------------|
| useToast | — |
| useMediaQuery | Reactively matches a CSS media query string. SSR-safe: returns `false` when `window` is unavailable. |
| useBreakpoint | Returns the current active breakpoint and convenience booleans. SSR-safe: defaults to `"lg"` (desktop) when `window` is unavailable. Breakpoint values match the layout token system: - sm: < 640px - md: 640px – 1023px - lg: 1024px – 1279px - xl: 1280px – 1535px - 2xl: >= 1536px |
| usePrefersReducedMotion | Returns `true` when the user has enabled "Prefer reduced motion" in their OS or browser settings. SSR-safe: returns `false` when `window` is unavailable. Note: CSS-level reduced motion is already handled by the Arcana token system (all `--duration-*` tokens are zeroed out via a `prefers-reduced-motion` media query in arcana.css). This hook is for **JavaScript-driven** animations where CSS transitions don't apply (e.g., number counters, auto-playing carousels). |
| useHotkey | Hook to listen for keyboard shortcuts. Automatically handles Cmd (Mac) vs Ctrl (Windows/Linux) when modifier includes "meta". Does not fire when user is typing in an input, textarea, or contenteditable. |
| useFloating | Positions a floating element relative to a trigger, with smart flip and viewport clamping. Zero dependencies — a lightweight alternative to Floating UI / Popper.js. |
| useClickOutside | Fires a callback when a click (mousedown) occurs outside of the referenced element. SSR-safe: does nothing when `document` is unavailable. |
| useDrag | Generic drag interaction hook. Handles mousedown/touchstart → document mousemove/touchmove → mouseup/touchend with optional RAF throttling and coordinate normalization. |
| useUndoRedo | Generic undo/redo history stack. New pushes after an undo clear the forward (redo) history. Stack size is bounded by `maxHistory`. |
| useTheme | Reads the persisted theme from localStorage. Returns `null` if no preference is stored or if running on the server. / function getStoredTheme(): ThemeId | null { if (typeof window === 'undefined') return null; try { const stored = localStorage.getItem(STORAGE_KEY); if (stored && THEME_IDS.includes(stored as ThemeId)) { return stored as ThemeId; } } catch { // localStorage may be unavailable (e.g., private browsing) } return null; } /** Persists the theme choice to localStorage, or removes it to follow system. / function storeTheme(theme: ThemeId | null): void { if (typeof window === 'undefined') return; try { if (theme === null) { localStorage.removeItem(STORAGE_KEY); } else { localStorage.setItem(STORAGE_KEY, theme); } } catch { // Silently fail if localStorage is unavailable } } /** Applies the theme to the document root element. / function applyTheme(theme: ThemeId): void { if (typeof document === 'undefined') return; document.documentElement.setAttribute(ATTRIBUTE, theme); } /** SSR-safe subscription to `prefers-color-scheme: dark` media query. / function useSystemPrefersDark(): boolean { const query = '(prefers-color-scheme: dark)'; const subscribe = useCallback((callback: () => void) => { if (typeof window === 'undefined') return () => {}; const mql = window.matchMedia(query); mql.addEventListener('change', callback); return () => mql.removeEventListener('change', callback); }, []); const getSnapshot = useCallback((): boolean => { if (typeof window === 'undefined') return false; return window.matchMedia(query).matches; }, []); const getServerSnapshot = useCallback((): boolean => false, []); return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot); } /** Manages theme switching with system preference detection, manual override, and localStorage persistence. SSR-safe: defaults to `"light"` when `window` is unavailable. |
| useThemeContext | Reads the persisted theme from localStorage. / function getStoredTheme(key: string): ThemeId | null { if (typeof window === 'undefined') return null; try { const stored = localStorage.getItem(key); if (stored && THEME_IDS.includes(stored as ThemeId)) { return stored as ThemeId; } } catch { // localStorage may be unavailable } return null; } /** Persists the theme choice to localStorage. / function storeTheme(key: string, theme: ThemeId | null): void { if (typeof window === 'undefined') return; try { if (theme === null) { localStorage.removeItem(key); } else { localStorage.setItem(key, theme); } } catch { // Silently fail } } /** Provides theme state to the component tree via React context. Handles system preference detection (`prefers-color-scheme`), manual override, localStorage persistence, and optional CSS transitions during theme changes. |


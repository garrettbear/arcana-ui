# EXTERNAL_REPOS.md — Arcana-UI Starter Templates

> Specification and implementation guide for two flagship starter templates under github.com/Arcana-UI/

---

## Overview

Two external repositories showcase Arcana-UI in real-world production contexts:

1. **`arcana-starter-saas`** — Next.js dashboard template (authentication, billing, settings, responsive)
2. **`arcana-starter-storefront`** — Vite + React marketing + ecommerce site (hero, products, cart, theming)

Both are public repositories, installable from npm (`@arcana-ui/core`, `@arcana-ui/tokens`), and serve as:

- **Real-world validation** — Expose DX friction, missing components, API pain points
- **Marketing material** — Prove Arcana scales to production; show GitHub stars and npm installs
- **Feedback loop** — Document every issue with a GitHub issue or FEEDBACK.md entry

---

## Repo 1: `arcana-starter-saas`

### Repository Identity

| Field | Value |
|-------|-------|
| **Name** | `arcana-starter-saas` |
| **Description** | Production-ready SaaS starter template. Build dashboards, auth flows, and settings pages with Arcana UI. Next.js 14+, TypeScript, Vercel-ready. |
| **Tagline** | "The SaaS template Arcana deserves." |
| **Owner** | Arcana-UI (GitHub organization) |
| **License** | MIT |
| **Topics** | `arcana-ui`, `saas-template`, `next-js`, `dashboard`, `auth`, `typescript`, `design-system` |
| **Badges** | Built with Arcana UI, Next.js, Deployed on Vercel |

### Tech Stack

**Runtime:**
- Node.js 18+
- Next.js 14+ (App Router)
- React 18+
- TypeScript (strict mode)
- @arcana-ui/core (from npm, not local)
- @arcana-ui/tokens (from npm, not local)

**Dev & Build:**
- pnpm
- TypeScript compiler
- Biome (lint + format) — match root Arcana repo config
- Vercel (deployment target)

**Auth & Data:**
- NextAuth.js v5 (or similar) — mock auth for demo; real auth optional for clone
- Fetch API or axios — no heavy HTTP libraries
- localStorage + React Context for lightweight state (cart, theme preference)

**No new runtime dependencies beyond the above.** Resist the temptation to add Redux, Zustand, shadcn/ui, or other component libraries.

### Page Map

| Route | Purpose | Key Arcana Components | Notes |
|-------|---------|---------------------|-------|
| `/` | Landing / dashboard redirect | Button, Hero typography | Redirects authenticated users to `/dashboard` |
| `/auth/login` | Login page | Input, Button, Card, Alert, Link | Email + password form, "Sign up" link, forgot password link |
| `/auth/register` | Register page | Input, Button, Card, Alert, Link | Email + password + confirm password, ToS checkbox, "Sign in" link |
| `/auth/forgot-password` | Password reset flow | Input, Button, Card, Alert | Enter email, receive reset link (mock), success state |
| `/auth/reset-password` | Reset password form | Input, Button, Card, Alert | New password + confirm, success toast |
| `/dashboard` | Main dashboard (authenticated) | Card, StatCard, ProgressBar, LineChart, BarChart, Badge, Grid layout | At-a-glance metrics (revenue, users, growth), mini charts, "Get started" widget |
| `/dashboard/analytics` | Deep analytics | DataTable, LineChart, DatePicker, Select, SegmentedControl, Badge | Time range picker, revenue/user/churn trends, CSV export button |
| `/dashboard/users` | User management | DataTable, Avatar, Badge, Button, Dialog, Input, Select | List with sort/filter/pagination, bulk actions, user detail modal |
| `/dashboard/products` | Products or features list | DataTable, Image, Badge, Button, Dialog | CRUD operations, add/edit/delete modals, status badges |
| `/dashboard/billing` | Billing & subscription | Card, Button, Badge, Select, Alert | Current plan, invoice history table, upgrade/downgrade buttons, usage meter |
| `/dashboard/settings` | Account settings | Input, Textarea, FileUpload, Toggle, Select, Button, Alert, Card | Profile info, email preferences, API keys (masked), danger zone with delete button |
| `/dashboard/settings/appearance` | Theme & density settings | Select, ThemeSwitcher component, Slider, Toggle, Grid | All 14 presets, density slider (if token system supports it), reduced-motion toggle, live preview |
| `/dashboard/settings/notification` | Notification preferences | Toggle, Select, Card, Button | Email, in-app, SMS toggles per notification type |
| `/docs` (or `/help`) | Quick help / onboarding | Accordion, Tabs, Alert, Link, CodeBlock | FAQ, keyboard shortcuts, API docs link, contact support |
| `/components` (optional) | Component showcase | One page per component type (buttons, forms, overlays, etc.) | Development aid, also serves as proof that Arcana components are used throughout |

### Component Usage Plan

**Target: Exercise 80+ of the 108 Arcana components across all pages.**

**Navigation (6 components):**
- Navbar (top bar with user menu)
- Sidebar (left navigation, collapsible)
- Breadcrumb (in page headers)
- Pagination (in DataTable pages)
- Tabs (in settings, analytics)
- SegmentedControl (filter buttons in analytics)

**Forms (15+ components):**
- Input (login, register, settings, product creation)
- Select (dropdowns in filters, settings)
- Textarea (bio, description fields)
- Checkbox (ToS, preferences)
- Radio (billing plan selection)
- Toggle (dark/light, email prefs, feature flags)
- FileUpload (avatar, banner, CSV import)
- DatePicker (analytics date range, user join date)
- TimePicker (if present; scheduled emails)
- Switch (notification toggles)
- Label (every form input)
- Button (submit, cancel, action)
- FormField wrapper (error display, help text)

**Data Display (20+ components):**
- DataTable (users, products, invoices, analytics)
- Avatar (user list, current user in navbar)
- Badge (status badges: active/inactive, plan tier, subscription status)
- Card (metric cards, section containers)
- StatCard (KPI numbers with trend sparkline)
- ProgressBar (subscription usage, onboarding steps)
- KPICard (large metric cards with secondary stat)
- Table (breakdown tables within cards)
- List (settings menu, notification types)
- ListItem (inside lists)
- Grid (responsive layout system)
- Stack (vertical/horizontal spacing)

**Overlays & Feedback (12+ components):**
- Dialog (confirm delete, user detail, bulk action confirmation)
- Drawer (edit panel, side details)
- Alert (validation errors, success messages, warnings)
- Toast (action feedback: saved, deleted, error occurred)
- Tooltip (help icons, abbreviated text)
- Popover (user menu, more options dropdown)
- CommandPalette (Cmd+K search across pages, documentation)
- Skeleton (loading state for analytics charts)
- Spinner (async operation in progress)
- Modal (if distinct from Dialog)
- DropdownMenu (user account menu, bulk actions)
- ContextMenu (right-click on table rows)

**Feedback & Status (8+ components):**
- Badge (inline status, plan tiers, permission levels)
- Pill (tags on products/users)
- EmptyState (no users yet, no products yet)
- ErrorBoundary (catch React errors, show fallback UI)
- ProgressRing (circular progress for subscription usage)
- Stepper (onboarding flow, multi-step forms)
- LoadingBar (top-of-page progress during navigation)
- StatusIndicator (online/offline, connection status in navbar)

**Ecommerce/Content (5+ components, if cart/product detail exists):**
- Image (product thumbnails, user avatars)
- Rating (product reviews, feature upvotes)
- Price (product pricing display)
- ProductCard (in product grid, if applicable)
- ReviewCard (if reviews page exists)

**Layout & Containers (8+ components):**
- Container (max-width wrapper)
- Grid (responsive grid layout)
- Stack (flex column/row spacing)
- Aspect Ratio (image containers)
- Divider (visual separation)
- Spacer (fixed-height spacing)
- Section (semantic page sections)
- MainContent (main area layout with sidebar)

**Utility & Patterns:**
- ThemeSwitcher (preset switcher in navbar or settings)
- DensitySwitcher (if supported by token system)
- ReducedMotionToggle (settings page)
- CodeBlock (docs page, example snippets)

**Charts (if @arcana-ui/charts exists; otherwise omit):**
- LineChart (revenue trends, user growth)
- BarChart (revenue by product, traffic by source)
- DonutChart (plan distribution, feature usage)

### Theme Strategy

**Display all 14 presets:**
- light, dark, terminal, retro98, glass, brutalist
- corporate, startup, editorial, commerce, midnight, nature, neon, mono

**Integration points:**

1. **Settings page** (`/dashboard/settings/appearance`) — ThemeSwitcher component with radio buttons or card grid showing all 14 presets. Persist selection to localStorage under `arcana-theme-preference`. Apply via `data-theme="preset-name"` on `<html>` root or Context Provider.

2. **Navbar** — Optional compact theme switcher (3-5 most popular presets) in user menu or dedicated icon.

3. **Live preview** — When user selects a theme, entire dashboard updates immediately. No page reload required.

4. **Default theme** — Start with `light`. On page load, read localStorage; if not found, detect system preference (`prefers-color-scheme: dark`) and choose `dark` or `light`.

5. **Marketing value** — Screenshot all 14 presets applied to the dashboard. Feature in README with before/after gallery.

**Density support (optional):**
If `@arcana-ui/tokens` ships with density modes (compact, normal, spacious), add a Slider or Radio buttons in appearance settings. Demonstrate compact mode reduces visual clutter on mobile; spacious on widescreen.

### DX Feedback Tracking

**During development, capture every pain point:**

1. **GitHub Issues** — Create with labels:
   - `feedback` — DX friction, missing features
   - `bug` — Actual bugs in Arcana
   - `missing-component` — Component that would solve a problem
   - `api-confusion` — Unclear prop names, misleading docs
   - `performance` — Bundle size, render performance, lazy loading
   - `accessibility` — WCAG violation, keyboard nav issue
   - `theming` — Token coverage gap, preset inconsistency

2. **FEEDBACK.md** (root of repo) — Narrative log of pain points, one per session:

   ```markdown
   # Development Feedback for Arcana-UI

   ## Session 1 — Authentication Pages
   - [x] Needed: OTP input component (one-time password, 6 digits)
   - [ ] Issue: FileUpload doesn't accept image/png only
   - [x] Confusion: Button `variant` prop not exported in types
   - ...

   ## Session 2 — Analytics Page
   - [ ] Missing: Date range picker for dashboards
   - ...
   ```

3. **CONTRIBUTING.md** (in this repo) — Link to main Arcana repo's contributing guidelines. Encourage cloners to report issues upstream.

4. **Deployment feedback** — After deploying to Vercel, note:
   - Bundle size report (target: < 250 kB gzipped with Arcana, React, Next.js)
   - Core Web Vitals (LCP, FID, CLS)
   - Any runtime errors from browser console

### README Template

```markdown
# arcana-starter-saas

Production-ready SaaS starter template built with [Arcana-UI](https://arcana-ui.com).

Build dashboards, auth flows, and admin panels with beautiful, responsive components out of the box.

## Features

- [x] **Next.js 14+ App Router** — Latest React server components
- [x] **TypeScript** — Strict mode, full IDE support
- [x] **Authentication** — Mock login/register/password reset (replace with real auth)
- [x] **Dashboard** — Analytics, users, products, billing, settings
- [x] **Responsive Design** — Works perfectly on mobile, tablet, desktop
- [x] **Theme Switcher** — All 14 Arcana presets; live theme switching
- [x] **Dark Mode** — System preference detection + manual toggle
- [x] **60+ Arcana Components** — Input, Button, DataTable, Card, Alert, and more
- [x] **Vercel Ready** — Deploy in one click

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
git clone https://github.com/Arcana-UI/arcana-starter-saas.git
cd arcana-starter-saas
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- Email: `demo@example.com`
- Password: `password`

(For development only. Replace with real auth before production.)

## Project Structure

```
arcana-starter-saas/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth pages (login, register, etc.)
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── layout.tsx        # Root layout, theme provider
│   │   └── page.tsx          # Home redirect
│   ├── components/           # Reusable components (header, sidebar, etc.)
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── ...
│   ├── lib/                  # Utilities, helpers
│   │   ├── auth.ts           # Mock auth (replace)
│   │   ├── cn.ts             # classNames utility
│   │   └── ...
│   └── styles/               # Global styles (if any)
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Key Pages

### Authentication

- `/auth/login` — Login form
- `/auth/register` — Registration form
- `/auth/forgot-password` — Password reset request
- `/auth/reset-password` — Password reset form

### Dashboard

- `/dashboard` — Overview with KPI cards, charts, widgets
- `/dashboard/analytics` — Detailed analytics with charts and filters
- `/dashboard/users` — User management table with CRUD
- `/dashboard/products` — Product management
- `/dashboard/billing` — Subscription and invoice history
- `/dashboard/settings` — Account settings and preferences
- `/dashboard/settings/appearance` — Theme and density switcher

## Customization

### Changing Branding

1. Update app name in `src/app/layout.tsx` (title, favicon)
2. Edit logo in `src/components/Header.tsx`
3. Update colors in `src/app/layout.tsx` (theme defaults)

### Adding Real Authentication

Replace mock auth in `src/lib/auth.ts` with your provider (NextAuth.js, Clerk, Supabase, etc.).

### Connecting to a Real Database

Add ORM (Prisma, Drizzle) and connect dashboard pages to actual data. Start with `/dashboard/users`.

### Adding More Pages

1. Create new folder under `src/app/(dashboard)/`
2. Add `page.tsx`
3. Import layout components (Header, Sidebar)
4. Use Arcana components for content

## Theming

The app ships with all 14 Arcana-UI presets:

- **Light** — Clean, default theme
- **Dark** — High-contrast dark mode
- **Terminal** — Retro terminal aesthetic
- **Retro98** — Windows 98 tribute
- **Glass** — Glassmorphism design
- **Brutalist** — Minimalist, raw design
- **Corporate** — Enterprise professional
- **Startup** — Modern, energetic
- **Editorial** — Content-focused
- **Commerce** — Ecommerce optimized
- **Midnight** — Deep blue evening theme
- **Nature** — Green, organic palette
- **Neon** — Cyberpunk bright neons
- **Mono** — Grayscale minimalist

Change themes in `/dashboard/settings/appearance` or press Cmd+T to toggle.

## Performance

- Gzipped bundle: ~180 kB (Next.js + React + Arcana)
- Core Web Vitals: Optimized for LCP < 2.5s, FID < 100ms, CLS < 0.1
- Image optimization: Next.js `<Image>` component

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Deploy

No env vars required for the demo.

### Docker

```bash
docker build -t arcana-starter-saas .
docker run -p 3000:3000 arcana-starter-saas
```

### Self-Hosted

```bash
pnpm build
pnpm start
```

## Feedback & Issues

Found a bug in Arcana-UI? Report it at [github.com/Arcana-UI/arcana/issues](https://github.com/Arcana-UI/arcana/issues).

Issues with this template? Open an issue here: [github.com/Arcana-UI/arcana-starter-saas/issues](https://github.com/Arcana-UI/arcana-starter-saas/issues)

See [FEEDBACK.md](./FEEDBACK.md) for development notes and known limitations.

## Contributing

Want to improve this template? See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT

## Built with Arcana-UI

[Arcana-UI](https://arcana-ui.com) is an open-source, token-driven design system. Learn more at [arcana-ui.com](https://arcana-ui.com).
```

### Definition of Done

A completed `arcana-starter-saas` repo has:

- [ ] All pages listed above exist and are functional
- [ ] 80+ Arcana components exercised across pages
- [ ] All 14 theme presets working with live switcher in settings
- [ ] TypeScript strict mode passes
- [ ] `pnpm lint` zero errors
- [ ] `pnpm build` succeeds (no warnings about hardcoded values)
- [ ] Responsive at 320px, 768px, 1280px, 1920px
- [ ] Accessibility audit passes (axe, WCAG AA minimum on all presets)
- [ ] Mock auth fully functional (login, register, forgot password, reset, logout)
- [ ] Dashboard pages load and display sample data
- [ ] Theme switcher works without page reload
- [ ] Vercel deploy successful and Core Web Vitals green
- [ ] README complete with quick start, features, structure, customization guide
- [ ] FEEDBACK.md started with at least 5 entries
- [ ] CONTRIBUTING.md links to main Arcana repo
- [ ] Initial GitHub issues created for any blockers found
- [ ] 50+ GitHub stars (marketing goal)

### Estimated Effort

- **Planning & setup** (Day 1): Repo structure, Next.js scaffolding, Arcana imports, Biome config — 2-3 hours
- **Auth pages** (Day 1-2): Login, register, forgot password, reset — 4 hours
- **Dashboard shell** (Day 2): Layout, header, sidebar, nav, theme switcher — 3 hours
- **Dashboard pages** (Day 3-5): Analytics, users, products, billing, settings, appearance — 8 hours
- **Component showcase** (Day 5): Optional component index page — 1 hour
- **Testing & accessibility** (Day 5-6): Responsive checks, axe audit, Core Web Vitals, FEEDBACK.md — 3 hours
- **README & docs** (Day 6): Complete README, CONTRIBUTING, FEEDBACK seed — 2 hours
- **Vercel deployment & polish** (Day 6): Deploy, test, fix issues — 2 hours

**Total: 25-27 hours (3-4 engineer days)**

---

## Repo 2: `arcana-starter-storefront`

### Repository Identity

| Field | Value |
|-------|-------|
| **Name** | `arcana-starter-storefront` |
| **Description** | Beautiful storefront and ecommerce template with Arcana-UI. Features product showcase, shopping cart, and order management. Vite + React, TypeScript, responsive. |
| **Tagline** | "A pixel-perfect product showcase, powered by Arcana." |
| **Owner** | Arcana-UI (GitHub organization) |
| **License** | MIT |
| **Topics** | `arcana-ui`, `storefront-template`, `ecommerce`, `vite`, `react`, `typescript`, `design-system` |
| **Badges** | Built with Arcana UI, Vite, Responsive, Accessibility |
| **Example Business** | Ricotta Bear (Bear's pizza catering side project; adds authenticity to demo data) |

### Tech Stack

**Runtime:**
- Node.js 18+
- Vite 5+ (React plugin, SWC transpiler)
- React 18+
- TypeScript (strict mode)
- @arcana-ui/core (from npm)
- @arcana-ui/tokens (from npm)
- React Router v6 (for page routing; optional: use file-based if using a meta-framework)

**Dev & Build:**
- pnpm
- TypeScript compiler
- Biome (lint + format, matching root Arcana config)
- Netlify or Vercel (deployment target)

**State & Data:**
- React Context + useState (cart, theme preference, user preferences)
- localStorage (cart persistence, theme choice)
- JSON mock data (no backend; ecommerce is frontend demo)

**No new runtime dependencies.** Avoid Redux, Zustand, Apollo, Stripe SDK, or other heavy libraries.

### Page Map

| Route | Purpose | Key Arcana Components | Notes |
|-------|---------|---------------------|-------|
| `/` | Landing page with hero + featured products | Button, Card, ProductCard, Badge, Grid, Stack, Image | "Ricotta Bear" hero, feature highlights, call-to-action buttons, featured products grid |
| `/menu` or `/shop` | Product catalog / menu | DataTable or Grid, Input (search), Select (filter), Badge, Price, Image, Pagination | Filterable product list (category, price range, rating, diet), search bar, 24-36 products |
| `/menu/:slug` | Product detail page | Image (carousel), Price, Rating, Button, Textarea (reviews), Card, TabsLists, Alert | Large product image, description, price, add-to-cart button, customer reviews, related products |
| `/cart` | Shopping cart | DataTable, Input (quantity), Button, Price, Alert, Card, Divider, Stepper | List of items in cart, quantity controls, remove item, subtotal/tax/total, proceed to checkout button |
| `/checkout` | Order checkout flow | Input (billing/shipping), Select, Checkbox, Stepper, Button, Alert, Card, Price | Multi-step form (shipping address, billing address, payment method), order summary, place order button |
| `/thank-you` | Order confirmation | Card, Button, Alert, Price, Stack | Order number, confirmation message, expected delivery, track order link, continue shopping button |
| `/about` | Brand story | Stack, Image, Card, Section | Ricotta Bear story, team bios, company values, mission statement |
| `/contact` | Contact form | Input, Textarea, Button, Select, Alert, Card | Name, email, message, subject; success confirmation |
| `/faq` | Frequently asked questions | Accordion, Button, Link | Common questions about menu, ordering, delivery, returns |
| `/theme-showcase` | All 14 presets applied to site | Select, Grid of preview cards showing each preset | Visual proof that storefront adapts to every preset; useful for marketing |

### Component Usage Plan

**Target: Exercise 75+ of the 108 Arcana components.**

**Navigation (5+ components):**
- Navbar (sticky top, logo, menu link, cart icon with badge, theme switcher)
- MobileNav (hamburger menu for < 768px)
- Footer (links, social icons, newsletter signup)
- Breadcrumb (on product detail pages)
- Pagination (on product listing)

**Forms (12+ components):**
- Input (search, email, name, address, zip code)
- Select (category filter, country/state, payment method)
- Textarea (product reviews, contact message, special instructions)
- Checkbox (agree to ToS, email signup, delivery options)
- Radio (shipping method, payment type)
- FileUpload (if user photos/reviews; optional)
- DatePicker (if subscription/recurring orders)
- Label (form accessibility)
- Button (submit, cancel, add to cart)

**Data Display (18+ components):**
- ProductCard (product grid, featured section)
- Card (containers for sections)
- Image (product photos, carousel on detail)
- Badge (new, sale, discount %, dietary info: vegan, gluten-free)
- Price (product pricing, cart line items, total)
- Rating (star rating + count on products)
- Grid (responsive product/menu grid, 2/3/4 columns)
- Stack (vertical spacing for sections)
- Divider (visual separation)
- Table or List (cart line items, order summary)
- ListItem (in filters, FAQs)
- Pill (tags: spicy, vegetarian, seasonal, organic)
- Section (semantic page sections)
- Container (max-width wrapper)

**Overlays & Feedback (12+ components):**
- Dialog (confirm remove from cart, apply coupon)
- Drawer (cart preview, side menu on mobile)
- Toast (added to cart, order placed, error)
- Alert (out of stock, delivery delay, promo banner)
- Tooltip (ingredient info, why review moderation)
- Popover (cart preview in navbar, filter help)
- CommandPalette (Cmd+K search products, navigation)
- Spinner (loading product page, processing order)
- Skeleton (loading state for product grid, detail)
- Modal (newsletter signup, promo code modal)
- DropdownMenu (filter/sort options)
- Notification (stock alerts if product back in stock; optional)

**Ecommerce (12+ components):**
- ProductCard (grid, featured, related)
- Image (carousel, gallery)
- Rating (star display, review count)
- Price (with strike-through on sale items)
- Badge (dietary tags, new/sale labels)
- ReviewCard (customer testimonials)
- CartIcon with Badge (item count)
- Button (Add to Cart, Buy Now, View Details)
- Stepper (checkout progress: cart -> shipping -> payment -> confirm)
- Pill (tags on products)
- PriceWithTax (total with tax calculation)
- Promotion (banner for discount codes)

**Feedback & Status (6+ components):**
- Alert (promo banner, delivery info, out of stock)
- Toast (added to cart, order confirmed)
- Badge (sale, new, dietary info)
- EmptyState (no items in cart, no search results)
- LoadingBar (page navigation progress)
- Skeleton (while product images load)

**Marketing & Content (8+ components):**
- Accordion (FAQ, collapse/expand)
- Tabs (product details, reviews, specs)
- Card (feature highlight, testimonial)
- Image (hero image, product photo)
- Stack/Grid (layout for testimonials, features)
- Section (semantic sections)
- Typography (headings, body, meta text)
- Link (navigation, external links)

**Layout & Utilities (10+ components):**
- Container (max-width wrapper)
- Grid (responsive columns: auto-fill, auto-fit)
- Stack (flexbox column/row with gap)
- Aspect Ratio (image containers, video embeds)
- Divider (visual separation)
- Spacer (fixed-height gaps)
- MainContent (page layout with sidebar for filters)
- FlexLayout (sidebar + main)
- Section (semantic page divisions)
- Footer (sticky footer component)

**Theme & Utilities:**
- ThemeSwitcher (preset switcher in navbar or footer)
- DensitySwitcher (if supported)
- ReducedMotionToggle (accessible animation disable)
- CodeBlock (if docs page)

**Animations:**
- Fade, Slide, Scale animations on product cards
- CartIcon animation (bounce when item added)
- Smooth page transitions (React Router animations)

### Theme Strategy

**Display all 14 presets to show storefront personality shifts:**

1. **Preset showcase page** (`/theme-showcase`) — Grid of 14 cards, each showing the same hero section in a different preset. Click any card to apply that theme globally.

2. **Navbar theme switcher** — Compact dropdown (5 most popular presets: light, dark, corporate, neon, nature) or full 14-preset selector.

3. **Live switching** — No page reload when changing theme. Applied via `data-theme="preset-name"` on root or Context Provider.

4. **Default theme** — Start with `light`. Detect system preference on first load. Remember user choice in localStorage.

5. **Theming considerations for storefront:**
   - **Light** — Clean, accessible default
   - **Dark** — Evening shopping mode
   - **Commerce** — Optimized for ecommerce (warm colors, action-oriented)
   - **Startup** — Modern, energetic vibe
   - **Nature** — Emphasizes natural/organic products (great for Ricotta Bear pizzas with fresh ingredients)
   - **Neon** — Bold, trendy, food/lifestyle appeal
   - **Glass** — Premium, high-end feel
   - **Retro98** — Fun, nostalgic; good for demo humor

6. **Marketing value** — Feature theme showcase in README with before/after screenshots. "See how Arcana transforms your storefront."

### DX Feedback Tracking

**Same as SaaS starter, but focus on ecommerce-specific friction:**

1. **GitHub Issues** with labels:
   - `feedback` — DX friction, missing ecommerce features
   - `bug` — Bugs in Arcana or template
   - `missing-component` — E.g., "Need a size/color picker," "star rating input component"
   - `cart-flow` — Shopping cart / checkout UX
   - `theme` — Visual or theming issues on a specific preset
   - `performance` — Image optimization, large product grid load time
   - `accessibility` — Form labels, focus management in cart

2. **FEEDBACK.md** (root) — Narrative log:

   ```markdown
   # Development Feedback for Arcana-UI

   ## Session 1 — Product Grid & Listing
   - [x] Needed: ProductCard component (image, title, price, rating, add-to-cart button)
   - [x] Confusion: Image aspect ratio handling unclear
   - [ ] Performance: 36 products with high-res images = slow initial load
   - ...

   ## Session 2 — Checkout Flow
   - [ ] Missing: Address autocomplete
   - [ ] Needed: Form field validation UI for shipping address
   - ...
   ```

3. **Performance tracking** — Monitor:
   - Image bundle size (optimize with WebP, lazy load)
   - Gzipped JS bundle (target: < 200 kB)
   - Core Web Vitals on product grid (LCP, CLS)
   - SEO (Open Graph for product sharing, JSON-LD schema)

4. **Feedback label in GitHub** — Every issue filed during development gets `feedback` + one of the specific labels above.

### README Template

```markdown
# arcana-starter-storefront

A beautiful, production-ready storefront template powered by [Arcana-UI](https://arcana-ui.com).

Showcase your products in style. Built with Vite, React, and 80+ Arcana components. All 14 presets included.

## Features

- [x] **Vite + React 18** — Lightning-fast development experience
- [x] **TypeScript** — Strict mode for confidence
- [x] **Product Showcase** — Hero section, featured products, full catalog
- [x] **Shopping Cart** — Add/remove items, persist to localStorage
- [x] **Checkout Flow** — Multi-step form (shipping, payment, confirm)
- [x] **Responsive Design** — Mobile-first, works from 320px to 2560px
- [x] **Theme Switcher** — All 14 Arcana presets; live switching
- [x] **Dark Mode** — System preference detection + manual toggle
- [x] **80+ Components** — Button, Card, ProductCard, Image, Rating, Price, and more
- [x] **Search & Filter** — Filter by category, price, rating, dietary info
- [x] **Ratings & Reviews** — Star ratings, customer testimonials
- [x] **Fast Performance** — Optimized images, smart lazy loading, gzipped < 200 kB
- [x] **Accessibility** — WCAG AA, keyboard navigation, ARIA labels

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
git clone https://github.com/Arcana-UI/arcana-starter-storefront.git
cd arcana-starter-storefront
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
arcana-starter-storefront/
├── src/
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── Menu.tsx          # Product catalog
│   │   ├── Product.tsx       # Product detail
│   │   ├── Cart.tsx          # Shopping cart
│   │   ├── Checkout.tsx      # Checkout flow
│   │   ├── ThankYou.tsx      # Order confirmation
│   │   ├── About.tsx         # About page
│   │   ├── Contact.tsx       # Contact form
│   │   ├── FAQ.tsx           # FAQ accordion
│   │   └── ThemeShowcase.tsx # All 14 presets
│   ├── components/           # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── ...
│   ├── lib/                  # Utilities
│   │   ├── products.ts       # Mock product data
│   │   ├── cart.ts           # Cart state logic
│   │   ├── cn.ts             # classNames utility
│   │   └── ...
│   ├── styles/               # Global CSS if needed
│   ├── App.tsx               # Router setup
│   └── main.tsx              # Vite entry
├── public/                   # Static assets (product images)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Pages

### Landing Page (`/`)

- Hero section with call-to-action
- Feature highlights
- Featured products grid (6-8 items)
- Testimonials carousel (optional)
- Newsletter signup
- Link to full menu

### Menu (`/menu`)

- Product grid (filterable, searchable)
- Filters: category, price range, rating, dietary
- Sort options: name, price, rating, newest
- Pagination
- Quick view modal or link to product detail

### Product Detail (`/menu/[slug]`)

- Large product image carousel
- Product title, description, price
- Star rating with review count
- Add to Cart button (with quantity selector)
- Related products (3-4 similar items)
- Customer reviews and rating breakdown
- Ingredient list / allergens

### Shopping Cart (`/cart`)

- List of items in cart
- Quantity controls (increment/decrement)
- Remove item button
- Subtotal, tax, shipping, total
- Proceed to Checkout button
- Continue Shopping button
- Empty cart state with link to menu

### Checkout (`/checkout`)

- **Step 1: Shipping Address** — Street, city, state, zip, country
- **Step 2: Billing Address** — Same as shipping or different
- **Step 3: Shipping Method** — Standard (5-7 days), Express (2-3 days), Overnight
- **Step 4: Payment** — Credit card or PayPal (mock)
- **Step 5: Order Review** — Summary of items, shipping, total, place order

All steps use Arcana form components (Input, Select, Checkbox, Button).

### Order Confirmation (`/thank-you`)

- Animated success message
- Order number (copy-to-clipboard)
- Expected delivery date
- Order summary (items, shipping, total)
- Track Order button (link to fake tracking page)
- Continue Shopping button
- Customer service contact info

### About (`/about`)

- Brand story (Ricotta Bear origin, mission, values)
- Team bios with photos
- Company milestones timeline
- Social proof / awards
- Link to contact page

### Contact (`/contact`)

- Contact form (name, email, subject, message)
- Map (optional; embedded Google Maps)
- Business hours / contact info
- Success message after submission
- Link to FAQ page

### FAQ (`/faq`)

- Accordion with common questions
- Categories: Ordering, Delivery, Payment, Returns, Dietary
- Search to filter FAQs
- Link to contact form at bottom

### Theme Showcase (`/theme-showcase`)

- Grid of 14 cards, each showing a preset name and preview
- Click any card to apply globally
- Shows how storefront transforms across presets
- Great for marketing / design inspiration

## Customization

### Changing Branding

1. Update app name in `src/App.tsx` and `index.html` (title, favicon)
2. Edit logo in `src/components/Navbar.tsx`
3. Update business name (replace "Ricotta Bear" with your brand)
4. Upload your product images to `public/images/`

### Connecting a Real Backend

1. Replace mock data in `src/lib/products.ts` with API calls
2. Add a backend (Node + Express, Django, Rails, Firebase, Shopify, etc.)
3. Implement user accounts and order persistence
4. Integrate Stripe or Squarespace for real payments

### Adding More Products

Add to `src/lib/products.ts`:

```typescript
{
  id: 'pepperoni-lovers',
  name: 'Pepperoni Lovers',
  slug: 'pepperoni-lovers',
  category: 'pizza',
  price: 16.99,
  image: '/images/pepperoni-lovers.jpg',
  description: 'Our signature... ',
  rating: 4.8,
  reviews: 127,
  tags: ['spicy', 'meat'],
}
```

### Adding New Pages

1. Create new component in `src/pages/`
2. Add route in `src/App.tsx`
3. Link from Navbar or Footer
4. Use Arcana components for content

## Theming

The storefront ships with all 14 Arcana-UI presets. Change themes in the navbar theme switcher or at `/theme-showcase` to see all options.

**Popular theme combinations:**

- **Light + Commerce** — Clean, professional ecommerce
- **Dark + Neon** — Bold, trendy, food/lifestyle
- **Light + Nature** — Organic, fresh, sustainable
- **Corporate** — Enterprise, professional
- **Retro98** — Fun, nostalgic, quirky

## Accessibility

- Fully keyboard navigable (Tab, Enter, Escape, Arrow keys)
- WCAG AA contrast on all presets
- Form labels and ARIA attributes throughout
- Focus indicators visible in every theme
- Reduced motion support for animations
- Screen reader friendly

## Performance

- **Bundle size** — ~180 kB gzipped (Vite + React + Arcana)
- **Image optimization** — WebP, lazy loading, optimized sizes
- **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Build time** — ~2 seconds with Vite

## Deployment

### Netlify (Recommended)

1. Push to GitHub
2. Connect repo to [Netlify](https://netlify.com)
3. Set build command: `pnpm build`
4. Set publish directory: `dist`
5. Deploy

### Vercel

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Deploy

### Docker

```bash
docker build -t arcana-starter-storefront .
docker run -p 3000:3000 arcana-starter-storefront
```

### Self-Hosted

```bash
pnpm build
pnpm preview
```

## Feedback & Issues

Found a bug in Arcana-UI? Report it at [github.com/Arcana-UI/arcana/issues](https://github.com/Arcana-UI/arcana/issues).

Issues with this template? Open an issue here: [github.com/Arcana-UI/arcana-starter-storefront/issues](https://github.com/Arcana-UI/arcana-starter-storefront/issues)

See [FEEDBACK.md](./FEEDBACK.md) for development notes and known limitations.

## Contributing

Want to improve this template? See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT

## Built with Arcana-UI

[Arcana-UI](https://arcana-ui.com) is an open-source, token-driven design system. Learn more at [arcana-ui.com](https://arcana-ui.com).
```

### Definition of Done

A completed `arcana-starter-storefront` repo has:

- [ ] All pages listed above exist and are functional
- [ ] 75+ Arcana components exercised across pages
- [ ] All 14 theme presets working with live switcher
- [ ] TypeScript strict mode passes
- [ ] `pnpm lint` zero errors
- [ ] `pnpm build` succeeds
- [ ] Responsive at 320px, 768px, 1280px, 1920px
- [ ] Accessibility audit passes (axe, WCAG AA on all presets)
- [ ] Cart persistence works (localStorage roundtrip)
- [ ] Theme switcher works without page reload
- [ ] Search and filter on product listing works
- [ ] Checkout flow is complete (5-step form to confirmation)
- [ ] Product images are optimized (WebP, lazy load)
- [ ] Gzipped JS bundle < 200 kB
- [ ] Core Web Vitals green (LCP < 2.5s)
- [ ] Deployment successful (Netlify or Vercel)
- [ ] README complete with customization guide
- [ ] FEEDBACK.md started with at least 5 entries
- [ ] CONTRIBUTING.md links to main Arcana repo
- [ ] 50+ GitHub stars (marketing goal)

### Estimated Effort

- **Planning & setup** (Day 1): Vite scaffolding, routes, Arcana imports, Biome — 2-3 hours
- **Landing page** (Day 1): Hero, features, featured products, testimonials — 2 hours
- **Product listing & detail** (Day 2): Grid, filters, search, carousel, reviews — 4 hours
- **Cart & checkout** (Day 2-3): Add/remove, cart page, 5-step checkout, confirmation — 4 hours
- **Secondary pages** (Day 3): About, contact, FAQ, theme showcase — 3 hours
- **Theme switching & utilities** (Day 3-4): ThemeSwitcher, ReducedMotionToggle, CSS utilities — 2 hours
- **Testing & accessibility** (Day 4-5): Responsive checks, axe audit, image optimization, FEEDBACK.md — 4 hours
- **README & docs** (Day 5): Complete README, CONTRIBUTING, setup guide — 2 hours
- **Deployment & polish** (Day 5): Netlify/Vercel deploy, Core Web Vitals tuning, bug fixes — 2 hours

**Total: 25-26 hours (3-4 engineer days)**

---

## Cross-Repo Patterns

Both repos follow these conventions for consistency:

### Token Usage

Every color, spacing, shadow, font, radius, and duration value references a CSS custom property. No hardcoded values.

```css
/* Good */
.button {
  background: var(--color-action-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: background var(--duration-fast) var(--ease-default);
}

/* Bad */
.button {
  background: #4f46e5;
  padding: 8px 16px;
  border-radius: 6px;
}
```

### Responsive Design

Mobile-first. Default styles = mobile. Layer `@media (min-width: ...)` for larger screens.

```css
/* Mobile first */
.grid { grid-template-columns: 1fr; }

/* Tablet+ */
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Accessibility Requirements

- Every interactive element is keyboard accessible (Tab, Enter, Escape, Arrow keys)
- Every form input has an associated `<label>`
- Color is never the sole state indicator (pair with text, icons, or patterns)
- Focus indicators visible in all 14 presets
- Minimum contrast: 4.5:1 (normal text), 3:1 (large text / UI elements)
- Touch targets: minimum 44x44px on mobile

### Theme Switching

Theme applied via `data-theme="preset-name"` on root `<html>` or Context Provider:

```typescript
// Root layout
<html data-theme={theme}>
  {children}
</html>

// Or via ThemeProvider context
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

Persist to localStorage:

```typescript
const [theme, setTheme] = useState<string>(
  localStorage.getItem('arcana-theme-preference') || 'light'
);

useEffect(() => {
  localStorage.setItem('arcana-theme-preference', theme);
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

Detect system preference on first load:

```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? 'dark' : 'light';
```

### Component Naming

All components from Arcana are imported with full names:

```typescript
import {
  Button,
  Card,
  DataTable,
  ProductCard,
  ThemeSwitcher,
} from '@arcana-ui/core';
```

No abbreviations, no renaming. This makes code searchable and reduces cognitive load.

### Error Handling & Validation

Use Arcana's `Alert` and `Toast` components for feedback:

```typescript
// Form validation error
<Alert variant="destructive" title="Error">
  Email is required.
</Alert>

// Action success
<Toast>
  Item added to cart!
</Toast>
```

Never use native `alert()` or browser console for user-facing feedback.

### Performance Budgets

Both repos aim for:

- **Gzipped JS bundle**: < 200 kB (Next.js + React + Arcana for SaaS; Vite + React + Arcana for storefront)
- **Gzipped CSS**: < 50 kB (Arcana token CSS)
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

Monitor with Lighthouse, WebPageTest, or Bundle Analyzer.

### Commit Message Convention

Both repos use conventional commits:

```
type(scope): description

Examples:
  feat(pages): add product detail page with carousel
  fix(cart): fix cart total not updating after item removal
  refactor(components): extract ProductCard into reusable component
  test(checkout): add tests for multi-step form validation
  docs(readme): add customization guide
  chore(deps): update arcana packages to 0.1.0
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`
Scopes: `pages`, `components`, `lib`, `styles`, `types`, `deps`, `ci`, `docs`

---

## Marketing Value

### GitHub & Social

Both repos drive:

1. **GitHub stars** — Quality starters attract developers. Target 50+ stars within 3 months.
2. **npm discovery** — When developers install `@arcana-ui/core`, they find links to these starter repos.
3. **Social proof** — Showcase repos in: Arcana landing page, Twitter/X, dev.to, Hacker News, Product Hunt.
4. **Clone count** — GitHub reports how many times a repo is cloned; high clones = validation.

### Content Marketing

1. **Blog post**: "Building a SaaS Dashboard with Arcana UI" (with GIF walkthrough)
2. **Blog post**: "How to Build a Beautiful Storefront in One Weekend" (Ricotta Bear story)
3. **YouTube video**: 10-min walkthrough of starter template
4. **Tweet thread**: "We shipped 2 production-ready Arcana-UI starters. Here's what we learned."

### Feedback Loop

Every issue filed during development becomes:

- A bug fix in Arcana (if real bug)
- A feature request (if missing component)
- A documentation improvement (if API unclear)
- A signal for the next iteration

This creates a virtuous cycle: real-world usage -> feedback -> better design system -> more confident developers.

### SEO

Both repos have:

- Descriptive README with keywords: "SaaS dashboard," "ecommerce template," "Arcana components," "React," "TypeScript"
- GitHub topics: `arcana-ui`, `saas-template`, `ecommerce`, `design-system`
- Deployment to Vercel/Netlify with live URLs (indexable by search engines)
- Open Graph meta tags on landing pages (shareable on social media)

---

## Known Risks

### Risk 1: API Changes in Arcana

**Problem**: If Arcana makes breaking changes (prop renames, component removal), both starters break.

**Mitigation**:
- Maintain starters on stable releases only; don't follow `develop`
- Pin Arcana versions in `package.json`: `@arcana-ui/core: "^0.1.0"`
- Monitor Arcana CHANGELOG; update starters when major versions ship
- Each breaking change in Arcana triggers a PR in both starters to migrate

### Risk 2: Missing Components

**Problem**: During development, you realize Arcana lacks a critical component (e.g., ProductCard, OTP input, date range picker).

**Mitigation**:
- Log in GitHub issues with `missing-component` label
- Temporarily create a local component (e.g., `src/components/ProductCard.tsx`) that mimics Arcana API
- Once Arcana ships the component, migrate the starter to use it
- Document the workaround in FEEDBACK.md

### Risk 3: Performance Regression

**Problem**: Adding products, components, or features bloats bundle size beyond 200 kB.

**Mitigation**:
- Check bundle size on every PR: `pnpm build && npm run analyze` (use Vite or Next.js bundler analyzer)
- Lazy-load pages and images (React Router lazy, next/image, next/dynamic)
- Tree-shake unused Arcana components (if Arcana exports allow it; currently doesn't; deferred to beta.3)
- Use dynamic imports for heavy components (e.g., DataTable, Charts)

### Risk 4: Theming Inconsistency

**Problem**: A preset (e.g., "neon") looks bad on one starter but good on another, creating confusion about preset quality.

**Mitigation**:
- Both starters use the exact same presets from `@arcana-ui/tokens`
- Test every preset on every page before release
- Document preset visual goals (e.g., "commerce preset = warm, action-oriented")
- If a preset doesn't work on a page, file an issue in Arcana, don't work around it in the starter

### Risk 5: Maintenance Burden

**Problem**: Maintaining two starters + main Arcana repo = overhead.

**Mitigation**:
- Automate testing: CI should run lint, typecheck, build, visual regression on every push
- Keep starters simple; resist feature creep (don't build a full ecommerce platform)
- Document setup once; reuse for both (DRY principle)
- Use GitHub Actions to auto-update Arcana dependencies when new versions ship
- Community contributions: encourage PRs; don't require all fixes to come from maintainers

### Risk 6: Onboarding Friction

**Problem**: New developers clone a starter and hit issues (missing setup step, unclear customization).

**Mitigation**:
- README is extremely thorough (quick start, project structure, customization, troubleshooting)
- CONTRIBUTING.md links to main Arcana repo and explains issue reporting
- FEEDBACK.md documents all known limitations
- Add GitHub issue templates (bug report, feature request, documentation)
- Respond quickly to GitHub issues (within 24-48 hours)

---

## Implementation Timeline

### Phase 1: Foundation (Week 1)

- [ ] Create both repos under github.com/Arcana-UI/
- [ ] Initial scaffold (Next.js for SaaS, Vite for storefront)
- [ ] Install Arcana from npm (not local links)
- [ ] Set up Biome, TypeScript, GitHub Actions CI
- [ ] Basic route structure and shell components (Navbar, Footer, Sidebar)
- [ ] Theme switcher + all 14 presets working

### Phase 2: Core Pages (Week 2)

**SaaS Starter:**
- [ ] Auth pages (login, register, forgot password, reset)
- [ ] Dashboard home with KPI cards
- [ ] Analytics page with charts and filters
- [ ] Users table with CRUD
- [ ] Settings page with appearance switcher

**Storefront:**
- [ ] Landing page (hero, features)
- [ ] Product listing with filters and search
- [ ] Product detail page with carousel and reviews
- [ ] Shopping cart with persistence
- [ ] Theme showcase page

### Phase 3: Polish & Testing (Week 3)

- [ ] Responsive checks (320px, 768px, 1280px, 1920px)
- [ ] Accessibility audit (axe, WCAG AA on all presets)
- [ ] Performance optimization (bundle size, image optimization, Core Web Vitals)
- [ ] GitHub Actions CI green (lint, typecheck, test, build)
- [ ] Deployment to Vercel/Netlify
- [ ] README complete with screenshots
- [ ] FEEDBACK.md started with 5+ entries

### Phase 4: Launch & Feedback (Week 4+)

- [ ] Ship both starters public
- [ ] Announce on Twitter/X, dev.to, Hacker News
- [ ] Monitor GitHub issues and FEEDBACK.md
- [ ] File upstream bugs/feature requests in main Arcana repo
- [ ] Maintain and iterate based on community feedback
- [ ] Create content (blog posts, videos, tweets)

---

## Summary

These two starters validate Arcana in real-world use, showcase the design system's versatility, and create a feedback loop that improves the core library. By shipping production-quality templates (not toy projects), we build developer trust, drive npm adoption, and generate authentic stories about what Arcana can do.

The SaaS template proves Arcana scales to complex dashboards with forms, auth, and data management. The storefront template proves Arcana can create beautiful, high-performance marketing sites with rich visual design. Together, they show the full spectrum of what Arcana enables.

Implementation is straightforward: follow the page maps, exercise 75+ components, test on all presets, document feedback, and deploy. Three weeks of focused engineering work yields two valuable, evergreen assets for the Arcana-UI GitHub organization.

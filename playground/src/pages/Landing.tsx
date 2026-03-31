import { Badge, Button, Input } from '@arcana-ui/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

// ─── SVG Icons (inline to avoid dependencies) ─────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TokensIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ComponentsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m15.5 5.5-2.8 2.8" />
      <path d="M18 8h-4" />
      <path d="m15.5 18.5-2.8-2.8" />
      <path d="M12 22v-4" />
      <path d="m8.5 18.5 2.8-2.8" />
      <path d="M6 8h4" />
      <path d="m8.5 5.5 2.8 2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ─── Theme Preview Data ────────────────────────────────────────────────────────

const THEME_PREVIEWS = [
  {
    id: 'light',
    name: 'Light',
    desc: 'Warm stone + indigo accent',
    bg: '#ffffff',
    surface: '#fafaf9',
    fg: '#1c1917',
    fgSecondary: '#78716c',
    accent: '#4f46e5',
    accentFg: '#ffffff',
    border: '#e7e5e4',
    inputBg: '#ffffff',
    noRadius: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    desc: 'Slate + vibrant indigo',
    bg: '#0f172a',
    surface: '#1e293b',
    fg: '#e2e8f0',
    fgSecondary: '#94a3b8',
    accent: '#818cf8',
    accentFg: '#0f172a',
    border: 'rgba(148,163,184,0.15)',
    inputBg: '#1e293b',
    noRadius: false,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    desc: 'Phosphor green on black',
    bg: '#0a0a0a',
    surface: '#111111',
    fg: '#00ff41',
    fgSecondary: '#00cc33',
    accent: '#00ff41',
    accentFg: '#0a0a0a',
    border: 'rgba(0,255,65,0.15)',
    inputBg: '#111111',
    noRadius: true,
  },
  {
    id: 'retro98',
    name: 'Retro 98',
    desc: 'Pixel-perfect Windows 98',
    bg: '#c0c0c0',
    surface: '#ffffff',
    fg: '#000000',
    fgSecondary: '#404040',
    accent: '#000080',
    accentFg: '#ffffff',
    border: '#808080',
    inputBg: '#ffffff',
    noRadius: true,
  },
  {
    id: 'glass',
    name: 'Glass',
    desc: 'Frosted translucent surfaces',
    bg: '#1a1a2e',
    surface: 'rgba(255,255,255,0.12)',
    fg: '#ffffff',
    fgSecondary: 'rgba(255,255,255,0.7)',
    accent: '#818cf8',
    accentFg: '#ffffff',
    border: 'rgba(255,255,255,0.2)',
    inputBg: 'rgba(255,255,255,0.1)',
    noRadius: false,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    desc: 'No mercy, no radius',
    bg: '#ffffff',
    surface: '#f5f5f5',
    fg: '#000000',
    fgSecondary: '#333333',
    accent: '#000000',
    accentFg: '#ffffff',
    border: '#000000',
    inputBg: '#ffffff',
    noRadius: true,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Enterprise navy + slate',
    bg: '#ffffff',
    surface: '#f8fafc',
    fg: '#0f172a',
    fgSecondary: '#475569',
    accent: '#1d4ed8',
    accentFg: '#ffffff',
    border: '#e2e8f0',
    inputBg: '#ffffff',
    noRadius: false,
  },
  {
    id: 'startup',
    name: 'Startup',
    desc: 'Vibrant violet energy',
    bg: '#ffffff',
    surface: '#f5f3ff',
    fg: '#18181b',
    fgSecondary: '#52525b',
    accent: '#7c3aed',
    accentFg: '#ffffff',
    border: '#ddd6fe',
    inputBg: '#ffffff',
    noRadius: false,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    desc: 'Elegant serif typography',
    bg: '#faf8f5',
    surface: '#fafaf9',
    fg: '#1c1917',
    fgSecondary: '#57534e',
    accent: '#1c1917',
    accentFg: '#ffffff',
    border: '#d6d3d1',
    inputBg: '#ffffff',
    noRadius: false,
  },
  {
    id: 'commerce',
    name: 'Commerce',
    desc: 'Clean product-focused green',
    bg: '#ffffff',
    surface: '#f3f4f6',
    fg: '#111827',
    fgSecondary: '#4b5563',
    accent: '#047857',
    accentFg: '#ffffff',
    border: '#e5e7eb',
    inputBg: '#ffffff',
    noRadius: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    desc: 'Deep navy + gold accents',
    bg: '#0a0e1a',
    surface: '#101829',
    fg: '#f1f5f9',
    fgSecondary: '#94a3b8',
    accent: '#fbbf24',
    accentFg: '#0a0e1a',
    border: 'rgba(148,163,184,0.15)',
    inputBg: '#101829',
    noRadius: false,
  },
  {
    id: 'nature',
    name: 'Nature',
    desc: 'Earth tones + warm greens',
    bg: '#f9faf6',
    surface: '#fafaf9',
    fg: '#292524',
    fgSecondary: '#57534e',
    accent: '#15803d',
    accentFg: '#ffffff',
    border: '#d6d3d1',
    inputBg: '#f9faf6',
    noRadius: false,
  },
  {
    id: 'neon',
    name: 'Neon',
    desc: 'Cyan + pink cyberpunk',
    bg: '#08080c',
    surface: '#111118',
    fg: '#f0f0f8',
    fgSecondary: '#a0a0b8',
    accent: '#22d3ee',
    accentFg: '#08080c',
    border: 'rgba(160,160,184,0.15)',
    inputBg: '#111118',
    noRadius: false,
  },
  {
    id: 'mono',
    name: 'Mono',
    desc: 'Pure black + white minimal',
    bg: '#ffffff',
    surface: '#f9fafb',
    fg: '#000000',
    fgSecondary: '#4b5563',
    accent: '#000000',
    accentFg: '#ffffff',
    border: '#d1d5db',
    inputBg: '#ffffff',
    noRadius: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Landing Page Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptValue, setPromptValue] = useState('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/playground');
  };

  return (
    <div className={styles.landing}>
      {/* Purple orb background element */}
      <div className={styles.heroGlow} aria-hidden="true" />

      {/* ═══ SECTION 1: Navbar ═══ */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo} aria-label="Arcana UI home">
            <img src="/logo-white.svg" alt="Arcana" className={styles.navLogoWordmark} />
          </Link>

          <ul className={styles.navLinks}>
            <li>
              <a href="https://arcana-design-system.vercel.app/docs" className={styles.navLink}>
                Docs
              </a>
            </li>
            <li>
              <Link to="/playground" className={styles.navLink}>
                Playground
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/Arcana-UI/arcana"
                className={styles.navLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>

          <div className={styles.navActions} />

          <Button
            variant="ghost"
            className={styles.navMobileToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        role="presentation"
      >
        <div
          className={styles.mobileMenuPanel}
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <Button
            variant="ghost"
            className={styles.mobileMenuClose}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </Button>
          <ul className={styles.mobileMenuLinks}>
            <li>
              <a
                href="https://arcana-design-system.vercel.app/docs"
                className={styles.mobileMenuLink}
              >
                Docs
              </a>
            </li>
            <li>
              <Link
                to="/playground"
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Playground
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/Arcana-UI/arcana"
                className={styles.mobileMenuLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <main>
        {/* ═══ SECTION 2: Hero ═══ */}
        <section className={styles.hero}>
          <Badge variant="info" className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Coming Soon
          </Badge>

          <h1 className={styles.heroHeadline}>
            Describe your brand.
            <br />
            <span className={styles.heroHeadlineAccent}>Get a design system.</span>
          </h1>

          <p className={styles.heroSubheadline}>
            Token-driven theming, 60+ React components, built for AI to assemble and humans to love.
          </p>

          <form onSubmit={handlePromptSubmit} className={styles.promptWrap}>
            <Input
              className={styles.promptInput}
              placeholder="Tell me about your brand — colors, mood, industry..."
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              aria-label="Describe your brand"
            />
            <Button
              variant="primary"
              className={styles.promptSubmit}
              type="submit"
              aria-label="Generate design system"
            >
              <ArrowIcon />
            </Button>
            <span className={styles.promptComingSoon}>AI generation coming soon</span>
          </form>

          <div className={styles.promptLinks}>
            or{' '}
            <Link to="/playground" className={styles.promptTextLink}>
              Browse themes
            </Link>
            {' · '}
            <Link to="/playground" className={styles.promptTextLink}>
              Start from scratch
            </Link>
          </div>
        </section>

        {/* ═══ SECTION 3: Logo Cloud ═══ */}
        <section className={styles.logoCloud}>
          <p className={styles.logoCloudLabel}>Built for AI tools</p>
          <div className={styles.logoCloudGrid}>
            {['Claude Code', 'Cursor', 'GitHub Copilot', 'v0', 'Bolt', 'Lovable'].map((name) => (
              <span key={name} className={styles.logoCloudItem}>
                <svg className={styles.logoCloudIcon} viewBox="0 0 20 20" fill="currentColor">
                  <rect x="2" y="2" width="16" height="16" rx="4" opacity="0.3" />
                  <rect x="5" y="5" width="10" height="10" rx="2" opacity="0.6" />
                </svg>
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 4: Features ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Arcana</h2>
          <p className={styles.sectionSubtitle}>
            A design system engineered for the AI era. Predictable for machines, beautiful for
            humans.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TokensIcon />
              </div>
              <h3 className={styles.featureTitle}>Token-Driven Theming</h3>
              <p className={styles.featureDesc}>
                One JSON file controls your entire design system. 2,600+ CSS variables across color,
                typography, spacing, elevation, motion, and more. Change the file, change
                everything.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ComponentsIcon />
              </div>
              <h3 className={styles.featureTitle}>60+ Production Components</h3>
              <p className={styles.featureDesc}>
                From Hero sections to DataTables. Dashboard, marketing, editorial, and e-commerce
                categories — all responsive, accessible, and theme-aware.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <AIIcon />
              </div>
              <h3 className={styles.featureTitle}>AI-First Architecture</h3>
              <p className={styles.featureDesc}>
                manifest.ai.json for discovery, semantic token naming, predictable component APIs.
                Built for machines to compose, gorgeous for humans to use.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 5: How It Works ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>
            From brand description to production UI in three steps.
          </p>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Describe</h3>
              <p className={styles.stepDesc}>
                Type your brand description. Arcana generates a complete theme — colors, typography,
                spacing, shadows — from a single sentence.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Customize</h3>
              <p className={styles.stepDesc}>
                Fine-tune with the visual editor. Adjust any of 2,600+ tokens, preview across 60+
                components in real time. Every change is instant.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Ship</h3>
              <p className={styles.stepDesc}>
                Export as JSON, CSS custom properties, or a full starter project. Works with any
                React app. Zero runtime cost.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 6: Theme Showcase ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>One system, infinite looks</h2>
          <p className={styles.sectionSubtitle}>
            Same components, completely different personalities. Each theme is a single JSON file.
          </p>

          <div className={styles.themeGrid}>
            {THEME_PREVIEWS.map((theme) => (
              <Link
                key={theme.id}
                to={`/playground?theme=${theme.id}`}
                className={styles.themeCard}
              >
                <div className={styles.themePreview} style={{ background: theme.bg }}>
                  <div
                    className={styles.themePreviewBtn}
                    style={{
                      background: theme.accent,
                      color: theme.accentFg,
                      borderRadius: theme.noRadius ? '0' : undefined,
                    }}
                  >
                    Get Started
                  </div>
                  <input
                    className={styles.themePreviewInput}
                    style={{
                      background: theme.inputBg,
                      color: theme.fg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: theme.noRadius ? '0' : undefined,
                    }}
                    value="jane@example.com"
                    readOnly
                    tabIndex={-1}
                  />
                  <div
                    className={styles.themePreviewCard}
                    style={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      color: theme.fgSecondary,
                      borderRadius: theme.noRadius ? '0' : undefined,
                    }}
                  >
                    <span
                      style={{
                        color: theme.fg,
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      Dashboard
                    </span>
                    Revenue is up 12% this month with 3 new enterprise accounts.
                  </div>
                </div>
                <div className={styles.themeMeta}>
                  <p className={styles.themeName}>{theme.name}</p>
                  <p className={styles.themeDesc}>{theme.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 7: Component Showcase ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Production-ready components</h2>
          <p className={styles.sectionSubtitle}>
            Every component is responsive, accessible, and fully token-driven. Here's a taste of
            what ships out of the box.
          </p>

          <div className={styles.browserFrame}>
            <div className={styles.browserBar}>
              <div className={styles.browserDot} />
              <div className={styles.browserDot} />
              <div className={styles.browserDot} />
              <span className={styles.browserUrl}>your-app.com</span>
            </div>
            <div className={styles.browserContent}>
              <div className={styles.showcaseInner} data-theme="light">
                <div className={styles.showcaseNav}>
                  <span className={styles.showcaseNavBrand}>Acme Inc</span>
                  <div className={styles.showcaseNavLinks}>
                    <span>Dashboard</span>
                    <span>Products</span>
                    <span>Analytics</span>
                  </div>
                  <span className={styles.showcaseNavCta}>New Project</span>
                </div>
                <div className={styles.showcaseStats}>
                  {[
                    { label: 'Revenue', value: '$48,293', trend: '+12.5%', up: true },
                    { label: 'Users', value: '2,847', trend: '+8.2%', up: true },
                    { label: 'Conversion', value: '3.24%', trend: '-0.4%', up: false },
                  ].map((stat) => (
                    <div key={stat.label} className={styles.showcaseStatCard}>
                      <div className={styles.showcaseStatLabel}>{stat.label}</div>
                      <div className={styles.showcaseStatValue}>{stat.value}</div>
                      <div
                        className={styles.showcaseStatTrend}
                        style={{ color: stat.up ? '#16a34a' : '#dc2626' }}
                      >
                        {stat.trend} from last month
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.showcaseTableWrap}>
                  <div className={styles.showcaseTable}>
                    <div className={styles.showcaseTableHead}>
                      <span>Customer</span>
                      <span>Plan</span>
                      <span>MRR</span>
                      <span>Status</span>
                    </div>
                    {[
                      { name: 'Linear', plan: 'Enterprise', mrr: '$12,000' },
                      { name: 'Vercel', plan: 'Business', mrr: '$4,800' },
                      { name: 'Notion', plan: 'Enterprise', mrr: '$8,400' },
                    ].map((row) => (
                      <div key={row.name} className={styles.showcaseTableRow}>
                        <span style={{ fontWeight: 500, color: '#1c1917' }}>{row.name}</span>
                        <span>{row.plan}</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{row.mrr}</span>
                        <span>
                          <Badge variant="success" size="sm" className={styles.showcaseBadge}>
                            Active
                          </Badge>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 8: Stats ═══ */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {[
              { value: '60+', label: 'Components' },
              { value: '2,600+', label: 'CSS Variables', accent: true },
              { value: '14', label: 'Theme Presets' },
              { value: '5', label: 'Site Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`${styles.statValue} ${stat.accent ? styles.statValueAccent : ''}`}>
                  {stat.value}
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 9: CTA ═══ */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaHeadline}>Start building with Arcana</h2>
          <p className={styles.ctaDesc}>
            Open the playground to explore themes, customize tokens, and preview every component in
            real time.
          </p>
          <div className={styles.ctaActions}>
            <Button
              variant="primary"
              size="lg"
              className={styles.ctaBtnPrimary}
              onClick={() => navigate('/playground')}
            >
              Open Playground
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={styles.ctaBtnSecondary}
              onClick={() => window.open('https://github.com/Arcana-UI/arcana', '_blank')}
            >
              View on GitHub
            </Button>
          </div>
        </section>
      </main>

      {/* ═══ SECTION 10: Footer ═══ */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <img src="/logo-white.svg" alt="Arcana" className={styles.footerLogo} />
            <p className={styles.footerBrandDesc}>
              The design system built for AI. Token-driven theming, production components, infinite
              possibilities.
            </p>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Product</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/playground" className={styles.footerLink}>
                  Playground
                </Link>
              </li>
              <li>
                <a
                  href="https://arcana-design-system.vercel.app/docs"
                  className={styles.footerLink}
                >
                  Docs
                </a>
              </li>
              <li>
                <Link to="/playground" className={styles.footerLink}>
                  Components
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a
                  href="https://github.com/Arcana-UI/arcana"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/org/arcana-ui"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Arcana-UI/arcana/blob/main/CLAUDE.md"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CLAUDE.md
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Community</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a
                  href="https://github.com/Arcana-UI/arcana/blob/main/CONTRIBUTING.md"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Arcana-UI/arcana/blob/main/ROADMAP.md"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Arcana-UI/arcana/blob/main/LICENSE"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>MIT License · Made with Arcana · &copy; 2026</span>
          <div className={styles.footerBottomLinks}>
            <a
              href="https://github.com/Arcana-UI/arcana"
              className={styles.footerBottomLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

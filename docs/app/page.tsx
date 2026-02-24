import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          color: '#fff',
          padding: '6rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '9999px',
              padding: '0.25rem 1rem',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            v0.1.0 — AI-first component library
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            Build interfaces
            <br />
            <span style={{ color: '#a5b4fc' }}>at the speed of thought</span>
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
            }}
          >
            Arcana UI is a modern React component library with 22 production-ready
            components, a warm stone/indigo design system, WCAG AA accessibility,
            and an AI-first API surface.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/docs"
              style={{
                background: '#fff',
                color: '#4f46e5',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Get Started
            </Link>
            <Link
              href="/docs/components/button"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '1rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Browse Components
            </Link>
          </div>
        </div>
      </section>

      {/* Code example */}
      <section
        style={{
          background: '#0f172a',
          padding: '4rem 2rem',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Get started in minutes
          </p>
          <pre
            style={{
              background: '#1e293b',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              overflowX: 'auto',
            }}
          >
            <code>{`npm install @arcana-ui/core @arcana-ui/tokens

# In your app entry point:
import '@arcana-ui/tokens/dist/arcana.css'

# Use any component:
import { Button, Input, Modal } from '@arcana-ui/core'

function App() {
  return (
    <Button variant="primary" size="md">
      Hello, Arcana
    </Button>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: '#fafaf9' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '3rem',
              color: '#1c1917',
            }}
          >
            Everything you need
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#fff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1c1917' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#78716c', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component list */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: '#1c1917',
            }}
          >
            22 production-ready components
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#78716c',
              marginBottom: '3rem',
              fontSize: '1.1rem',
            }}
          >
            Primitives, composites, patterns — all with accessible markup and
            CSS custom properties.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            {components.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                style={{
                  padding: '0.4rem 0.9rem',
                  border: '1px solid #e7e5e4',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  color: '#44403c',
                  textDecoration: 'none',
                  background: '#fafaf9',
                  transition: 'all 0.15s',
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #e7e5e4',
          padding: '2rem',
          textAlign: 'center',
          color: '#78716c',
          fontSize: '0.875rem',
        }}
      >
        <p>
          Arcana UI — MIT License.{' '}
          <Link href="/docs" style={{ color: '#4f46e5' }}>
            Documentation
          </Link>{' '}
          ·{' '}
          <a
            href="https://github.com/your-org/arcana-ui"
            style={{ color: '#4f46e5' }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  )
}

const features = [
  {
    icon: '🎨',
    title: 'Design tokens',
    description:
      'A complete warm stone/indigo palette with semantic color roles, spacing, radius, shadow, and motion tokens — all as CSS custom properties.',
  },
  {
    icon: '♿',
    title: 'Accessible by default',
    description:
      'Every component passes axe-core checks. Keyboard navigation, ARIA attributes, focus management, and screen-reader support built in.',
  },
  {
    icon: '🤖',
    title: 'AI-first',
    description:
      'Ships with llms.txt, llms-full.txt, and manifest.ai.json so AI assistants can understand and use your component API without docs.',
  },
  {
    icon: '🎭',
    title: 'Dark mode',
    description:
      'First-class dark mode support via CSS custom properties. Switch themes at runtime without JavaScript re-renders.',
  },
  {
    icon: '📦',
    title: 'Zero runtime overhead',
    description:
      'CSS Modules, no CSS-in-JS, no runtime style injection. Tree-shaken ESM output for lean production bundles.',
  },
  {
    icon: '🔧',
    title: 'Composable',
    description:
      'Every component accepts className and style overrides. CSS custom properties let you theme at any level without forking.',
  },
]

const components = [
  { name: 'Button', href: '/docs/components/button' },
  { name: 'Input', href: '/docs/components/input' },
  { name: 'Textarea', href: '/docs/components/textarea' },
  { name: 'Select', href: '/docs/components/select' },
  { name: 'Checkbox', href: '/docs/components/checkbox' },
  { name: 'Radio', href: '/docs/components/radio' },
  { name: 'Toggle', href: '/docs/components/toggle' },
  { name: 'Badge', href: '/docs/components/badge' },
  { name: 'Avatar', href: '/docs/components/avatar' },
  { name: 'Card', href: '/docs/components/card' },
  { name: 'Modal', href: '/docs/components/modal' },
  { name: 'Alert', href: '/docs/components/alert' },
  { name: 'Toast', href: '/docs/components/toast' },
  { name: 'Tabs', href: '/docs/components/tabs' },
  { name: 'Accordion', href: '/docs/components/accordion' },
  { name: 'Table', href: '/docs/components/table' },
  { name: 'Form', href: '/docs/components/form' },
  { name: 'Navbar', href: '/docs/components/navbar' },
  { name: 'EmptyState', href: '/docs/components/empty-state' },
  { name: 'Stack / HStack', href: '/docs/components/layout' },
  { name: 'Grid', href: '/docs/components/layout' },
  { name: 'Container', href: '/docs/components/layout' },
]

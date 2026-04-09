/**
 * Starter site layouts. Each layout returns the imports + JSX body for
 * a single page so the framework template (vite.ts / next.ts) can splice
 * it into App.tsx / page.tsx without caring which layout was picked.
 *
 * Every layout uses REAL Arcana imports — the goal is that `npx arcana-ui
 * init` produces a project that runs against the published @arcana-ui/core
 * package with zero edits.
 *
 * Vite layouts are wrapped in a function body (`return (...)`) and Next.js
 * layouts are returned as JSX expressions because the App Router page
 * component returns JSX directly. The shape is identical otherwise.
 */

export type LayoutId = 'dashboard' | 'marketing' | 'ecommerce' | 'editorial' | 'general';

export interface LayoutMeta {
  id: LayoutId;
  label: string;
  description: string;
}

export const LAYOUTS: LayoutMeta[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Sidebar + KPI cards + data table (SaaS / admin)',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Hero + features + pricing + CTA (landing page)',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Navbar + product grid + footer (storefront)',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'ArticleLayout + author + pull quote + related posts (blog)',
  },
  {
    id: 'general',
    label: 'General',
    description: 'Minimal Navbar + Hero + Footer (start from scratch)',
  },
];

export interface LayoutSource {
  /** Import lines that go at the top of the file. */
  imports: string;
  /** JSX body — already indented; goes inside the page/App function. */
  body: string;
}

/* ------------------------------------------------------------------------ */
/*  Dashboard                                                                */
/* ------------------------------------------------------------------------ */

const dashboardLayout: LayoutSource = {
  imports: `import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSection,
  SidebarItem,
  StatCard,
  KPICard,
  DataTable,
  Badge,
  Button,
  type ColumnDef,
} from '@arcana-ui/core';`,
  body: `  interface Order {
    id: string;
    customer: string;
    status: 'paid' | 'pending' | 'refunded';
    total: number;
  }

  const orders: Order[] = [
    { id: 'ORD-1024', customer: 'Acme Co.', status: 'paid', total: 1240 },
    { id: 'ORD-1025', customer: 'Globex', status: 'pending', total: 480 },
    { id: 'ORD-1026', customer: 'Initech', status: 'paid', total: 2310 },
    { id: 'ORD-1027', customer: 'Umbrella', status: 'refunded', total: 90 },
  ];

  const columns: ColumnDef<Order>[] = [
    { key: 'id', header: 'Order', sortable: true },
    { key: 'customer', header: 'Customer', sortable: true, filterable: true },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'paid' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      sortable: true,
      render: (value) => \`$\${value}\`,
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar>
        <SidebarHeader>
          <strong>Arcana</strong>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection label="Workspace">
            <SidebarItem active>Overview</SidebarItem>
            <SidebarItem>Orders</SidebarItem>
            <SidebarItem badge="12">Customers</SidebarItem>
            <SidebarItem>Analytics</SidebarItem>
          </SidebarSection>
          <SidebarSection label="Settings">
            <SidebarItem>Team</SidebarItem>
            <SidebarItem>Billing</SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>

      <main
        style={{
          flex: 1,
          padding: 'var(--spacing-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
          background: 'var(--color-bg-canvas)',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Overview</h1>
            <p style={{ margin: 0, color: 'var(--color-fg-muted)' }}>
              Last 30 days
            </p>
          </div>
          <Button variant="primary">New order</Button>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          <StatCard
            label="Revenue"
            value={48230}
            prefix="$"
            trend={{ value: 12.4, direction: 'up' }}
            comparison="vs last month"
          />
          <StatCard
            label="Orders"
            value={1842}
            trend={{ value: 5.1, direction: 'up' }}
          />
          <StatCard
            label="Refunds"
            value={42}
            trend={{ value: 1.8, direction: 'down' }}
          />
          <KPICard
            label="Active customers"
            value={912}
            trend={{ value: 8.2, direction: 'up' }}
            data={[12, 18, 14, 22, 30, 28, 36, 42, 38, 50]}
            period="last 10 days"
          />
        </section>

        <section>
          <h2>Recent orders</h2>
          <DataTable<Order>
            data={orders}
            columns={columns}
            sortable
            filterable
            hoverable
            striped
          />
        </section>
      </main>
    </div>
  );`,
};

/* ------------------------------------------------------------------------ */
/*  Marketing                                                                */
/* ------------------------------------------------------------------------ */

const marketingLayout: LayoutSource = {
  imports: `import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Button,
  Hero,
  FeatureSection,
  PricingCard,
  CTA,
  Footer,
  FooterSection,
  FooterLink,
  FooterBottom,
} from '@arcana-ui/core';`,
  body: `  return (
    <>
      <Navbar sticky>
        <NavbarBrand>
          <strong>Arcana</strong>
        </NavbarBrand>
        <NavbarContent>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
        </NavbarContent>
        <NavbarActions>
          <Button variant="ghost">Sign in</Button>
          <Button variant="primary">Get started</Button>
        </NavbarActions>
      </Navbar>

      <Hero
        badge="New — v1.0"
        headline="Build production UI in minutes"
        subheadline="A token-driven design system for teams that ship fast and stay consistent."
        primaryCTA={{ label: 'Get started', href: '#pricing' }}
        secondaryCTA={{ label: 'View on GitHub', href: 'https://github.com' }}
        align="center"
        height="large"
      />

      <FeatureSection
        title="Everything you need"
        subtitle="Tokens, components, and primitives that compose into anything."
        columns={3}
        features={[
          {
            title: 'Token-driven',
            description: 'Change one JSON file. Watch the entire UI update.',
          },
          {
            title: 'Accessible by default',
            description: 'WCAG AA contrast, keyboard nav, ARIA out of the box.',
          },
          {
            title: 'Framework agnostic',
            description: 'Pure CSS variables. Works with Vite, Next.js, Remix.',
          },
          {
            title: '14 themes built-in',
            description: 'Light, dark, terminal, brutalist, and 10 more presets.',
          },
          {
            title: 'Responsive',
            description: 'Mobile-first across every component, from 320px to 4K.',
          },
          {
            title: 'AI-friendly',
            description: 'Predictable APIs and a manifest for code generation.',
          },
        ]}
      />

      <section
        id="pricing"
        style={{
          padding: 'var(--spacing-2xl) var(--spacing-xl)',
          display: 'grid',
          gap: 'var(--spacing-lg)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <PricingCard
          name="Starter"
          price={0}
          period="forever"
          description="For solo builders and side projects."
          features={[
            { label: 'Unlimited components', included: true },
            { label: 'All 14 themes', included: true },
            { label: 'Email support', included: false },
          ]}
          cta={{ label: 'Start free', href: '#' }}
        />
        <PricingCard
          name="Team"
          price={29}
          period="month"
          description="For growing product teams."
          popular
          features={[
            { label: 'Everything in Starter', included: true },
            { label: 'Priority support', included: true },
            { label: 'Custom presets', included: true },
          ]}
          cta={{ label: 'Try Team', href: '#' }}
        />
        <PricingCard
          name="Enterprise"
          price="Custom"
          description="For organizations with security needs."
          features={[
            { label: 'Everything in Team', included: true },
            { label: 'SSO + SAML', included: true },
            { label: 'Dedicated support', included: true },
          ]}
          cta={{ label: 'Contact us', href: '#' }}
        />
      </section>

      <CTA
        headline="Ready to build?"
        description="Join thousands of teams shipping with Arcana."
        primaryCTA={{ label: 'Get started', href: '#pricing' }}
        variant="banner"
      />

      <Footer>
        <FooterSection title="Product">
          <FooterLink href="#features">Features</FooterLink>
          <FooterLink href="#pricing">Pricing</FooterLink>
          <FooterLink href="#changelog">Changelog</FooterLink>
        </FooterSection>
        <FooterSection title="Company">
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#contact">Contact</FooterLink>
        </FooterSection>
        <FooterBottom>
          © {new Date().getFullYear()} Arcana. All rights reserved.
        </FooterBottom>
      </Footer>
    </>
  );`,
};

/* ------------------------------------------------------------------------ */
/*  E-commerce                                                               */
/* ------------------------------------------------------------------------ */

const ecommerceLayout: LayoutSource = {
  imports: `import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Button,
  Badge,
  ProductCard,
  Footer,
  FooterSection,
  FooterLink,
  FooterBottom,
} from '@arcana-ui/core';`,
  body: `  const products = [
    {
      title: 'Atlas Tote',
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600',
      price: { current: 89, original: 120, currency: 'USD' },
      rating: { value: 4.5, count: 132 },
      badge: 'Sale',
    },
    {
      title: 'Linen Shirt',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
      price: { current: 64, currency: 'USD' },
      rating: { value: 4.8, count: 87 },
    },
    {
      title: 'Walnut Chair',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
      price: { current: 320, currency: 'USD' },
      rating: { value: 4.9, count: 45 },
      badge: 'New',
    },
    {
      title: 'Ceramic Mug',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
      price: { current: 18, currency: 'USD' },
      rating: { value: 4.6, count: 210 },
    },
  ];

  return (
    <>
      <Navbar sticky border>
        <NavbarBrand>
          <strong>Arcana Goods</strong>
        </NavbarBrand>
        <NavbarContent>
          <a href="#new">New</a>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
        </NavbarContent>
        <NavbarActions>
          <Button variant="ghost">Sign in</Button>
          <Button variant="primary">
            Cart <Badge variant="default">3</Badge>
          </Button>
        </NavbarActions>
      </Navbar>

      <main
        style={{
          padding: 'var(--spacing-xl)',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <header style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ margin: 0 }}>Featured</h1>
          <p style={{ color: 'var(--color-fg-muted)' }}>
            Hand-picked pieces, fresh this week.
          </p>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.title}
              title={product.title}
              image={product.image}
              price={product.price}
              rating={product.rating}
              badge={product.badge}
              onAddToCart={() => console.log('add', product.title)}
              onFavorite={() => console.log('favorite', product.title)}
            />
          ))}
        </section>
      </main>

      <Footer>
        <FooterSection title="Shop">
          <FooterLink href="#new">New arrivals</FooterLink>
          <FooterLink href="#sale">Sale</FooterLink>
        </FooterSection>
        <FooterSection title="Help">
          <FooterLink href="#shipping">Shipping</FooterLink>
          <FooterLink href="#returns">Returns</FooterLink>
        </FooterSection>
        <FooterBottom>
          © {new Date().getFullYear()} Arcana Goods.
        </FooterBottom>
      </Footer>
    </>
  );`,
};

/* ------------------------------------------------------------------------ */
/*  Editorial                                                                */
/* ------------------------------------------------------------------------ */

const editorialLayout: LayoutSource = {
  imports: `import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  ArticleLayout,
  AuthorCard,
  PullQuote,
  RelatedPosts,
  NewsletterSignup,
  Badge,
  Footer,
  FooterBottom,
} from '@arcana-ui/core';`,
  body: `  return (
    <>
      <Navbar border>
        <NavbarBrand>
          <strong>The Arcana Journal</strong>
        </NavbarBrand>
        <NavbarContent>
          <a href="#essays">Essays</a>
          <a href="#interviews">Interviews</a>
          <a href="#archive">Archive</a>
        </NavbarContent>
      </Navbar>

      <ArticleLayout maxWidth="prose">
        <Badge variant="default">Design</Badge>
        <h1>The case for token-driven systems</h1>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--font-size-lg)' }}>
          Why centralizing visual decisions in a single JSON file changes how
          teams ship product.
        </p>

        <AuthorCard
          name="Avery Chen"
          role="Design Engineer"
          bio="Writes about systems, tooling, and the craft of UI."
          variant="inline"
        />

        <p>
          For years, design systems have lived as Figma files on one side and
          React components on the other — two sources of truth that drift the
          moment a designer tweaks a color. Tokens collapse that gap.
        </p>

        <PullQuote
          quote="A theme is just a JSON file. Change it, change everything."
          attribution="Garrett Bear, creator of Arcana"
          variant="accent"
        />

        <p>
          When every visual decision lives behind a CSS custom property, the
          surface area for inconsistency disappears. Designers ship tokens.
          Engineers consume them. The browser does the rest.
        </p>

        <h2>Three principles</h2>
        <p>
          The rest of this essay explores three principles for building
          token-driven systems that scale: layered semantics, predictable
          naming, and progressive disclosure for theming.
        </p>

        <NewsletterSignup
          title="Get more like this"
          description="One essay a week on systems, tooling, and craft."
          variant="card"
          onSubmit={(email) => console.log('subscribe', email)}
        />
      </ArticleLayout>

      <section
        style={{
          padding: 'var(--spacing-2xl) var(--spacing-xl)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <RelatedPosts
          title="Keep reading"
          columns={3}
          posts={[
            {
              title: 'Designing for AI agents',
              excerpt: 'How predictable APIs change everything.',
              href: '#1',
              category: 'Essays',
            },
            {
              title: 'OKLCH in production',
              excerpt: 'Perceptually uniform color in real apps.',
              href: '#2',
              category: 'Color',
            },
            {
              title: 'Why we ditched Tailwind',
              excerpt: 'A year with pure CSS variables.',
              href: '#3',
              category: 'Tooling',
            },
          ]}
        />
      </section>

      <Footer variant="minimal">
        <FooterBottom>
          © {new Date().getFullYear()} The Arcana Journal.
        </FooterBottom>
      </Footer>
    </>
  );`,
};

/* ------------------------------------------------------------------------ */
/*  General                                                                  */
/* ------------------------------------------------------------------------ */

const generalLayout: LayoutSource = {
  imports: `import {
  Navbar,
  NavbarBrand,
  NavbarActions,
  Button,
  Hero,
  Footer,
  FooterBottom,
} from '@arcana-ui/core';`,
  body: `  return (
    <>
      <Navbar sticky>
        <NavbarBrand>
          <strong>My App</strong>
        </NavbarBrand>
        <NavbarActions>
          <Button variant="primary">Get started</Button>
        </NavbarActions>
      </Navbar>

      <Hero
        headline="Hello, Arcana"
        subheadline="Edit this file to start building. Every component is themed by tokens — try switching themes by changing data-theme on the root element."
        primaryCTA={{ label: 'Read the docs', href: 'https://arcana-ui.com' }}
        align="center"
      />

      <Footer variant="minimal">
        <FooterBottom>
          Built with Arcana UI · {new Date().getFullYear()}
        </FooterBottom>
      </Footer>
    </>
  );`,
};

/* ------------------------------------------------------------------------ */
/*  Registry                                                                 */
/* ------------------------------------------------------------------------ */

const LAYOUT_SOURCES: Record<LayoutId, LayoutSource> = {
  dashboard: dashboardLayout,
  marketing: marketingLayout,
  ecommerce: ecommerceLayout,
  editorial: editorialLayout,
  general: generalLayout,
};

export function getLayout(id: LayoutId): LayoutSource {
  return LAYOUT_SOURCES[id];
}

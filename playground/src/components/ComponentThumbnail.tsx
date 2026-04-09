/**
 * ComponentThumbnail — small visual preview of a component for the gallery grid.
 * Renders a simplified version of each component at thumbnail size.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AuthorCard,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CTA,
  Card,
  CardBody,
  Carousel,
  Checkbox,
  Collapsible,
  CopyButton,
  DatePicker,
  Divider,
  EmptyState,
  FeatureSection,
  Footer,
  FooterBottom,
  FooterSection,
  Hero,
  Image,
  Input,
  KPICard,
  KeyboardShortcut,
  LogoCloud,
  NavbarBrand,
  NavbarContent,
  NewsletterSignup,
  Pagination,
  PriceDisplay,
  PricingCard,
  ProgressBar,
  PullQuote,
  QuantitySelector,
  Radio,
  RatingStars,
  RelatedPosts,
  ScrollArea,
  Select,
  Sidebar,
  SidebarContent,
  SidebarItem,
  Skeleton,
  Spacer,
  Spinner,
  StatCard,
  StatsBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Testimonial,
  Timeline,
  Toggle,
} from '@arcana-ui/core';

interface ThumbnailProps {
  slug: string;
}

const wrap: React.CSSProperties = {
  transform: 'scale(0.65)',
  transformOrigin: 'center',
  pointerEvents: 'none',
  width: '100%',
  maxWidth: '280px',
  overflow: 'hidden',
};

const flexRow: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const flexCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%',
};

export function ComponentThumbnail({ slug }: ThumbnailProps) {
  switch (slug) {
    // ─── Primitives ─────────────────────────────────────────────────────
    case 'button':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>
      );
    case 'badge':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Badge size="sm">Default</Badge>
          <Badge size="sm" variant="success">
            Success
          </Badge>
          <Badge size="sm" variant="error">
            Error
          </Badge>
          <Badge size="sm" variant="info">
            Info
          </Badge>
        </div>
      );
    case 'input':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Input size="sm" placeholder="Type here..." />
        </div>
      );
    case 'textarea':
      return (
        <div
          style={{
            ...wrap,
            width: '180px',
          }}
        >
          <div
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-fg-muted)',
              height: '48px',
              background: 'var(--color-bg-surface)',
            }}
          >
            Write something...
          </div>
        </div>
      );
    case 'select':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Select size="sm">
            <option>Select option...</option>
          </Select>
        </div>
      );
    case 'checkbox':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Checkbox label="Option A" size="sm" defaultChecked />
          <Checkbox label="Option B" size="sm" />
        </div>
      );
    case 'radio':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Radio label="Yes" size="sm" name="thumb-radio" defaultChecked />
          <Radio label="No" size="sm" name="thumb-radio" />
        </div>
      );
    case 'toggle':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Toggle size="sm" label="On" defaultChecked />
          <Toggle size="sm" label="Off" />
        </div>
      );
    case 'avatar':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <Avatar size="sm" initials="AB" />
          <Avatar size="sm" initials="CD" />
          <Avatar size="sm" initials="EF" />
        </div>
      );

    // ─── Composites ─────────────────────────────────────────────────────
    case 'card':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <Card padding="sm">
            <CardBody>
              <span style={{ fontSize: 'var(--font-size-xs)' }}>Card content</span>
            </CardBody>
          </Card>
        </div>
      );
    case 'alert':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Alert variant="info" title="Info alert" />
        </div>
      );
    case 'modal':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Card padding="sm">
            <CardBody>
              <div
                style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}
              >
                Dialog Title
              </div>
              <div
                style={{ fontSize: '10px', color: 'var(--color-fg-muted)', marginBottom: '6px' }}
              >
                Are you sure you want to continue?
              </div>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
                <Button size="sm">Confirm</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    case 'tabs':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Tabs defaultIndex={0}>
            <TabList>
              <Tab>Tab 1</Tab>
              <Tab>Tab 2</Tab>
              <Tab>Tab 3</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <span style={{ fontSize: '10px' }}>Panel content</span>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      );
    case 'accordion':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Accordion>
            <AccordionItem value="1">
              <AccordionTrigger>Section 1</AccordionTrigger>
              <AccordionContent>Content</AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger>Section 2</AccordionTrigger>
              <AccordionContent>Content</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    case 'banner':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <Banner variant="info">Important announcement</Banner>
        </div>
      );
    case 'skeleton':
      return (
        <div style={{ ...wrap, ...flexCol, width: '160px' }}>
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
          <Skeleton width="60%" height={12} />
        </div>
      );
    case 'spinner':
      return (
        <div style={wrap}>
          <Spinner size="md" />
        </div>
      );
    case 'toast':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Card padding="sm">
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--color-success-fg)', fontSize: '14px' }}>&#10003;</span>
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500 }}>
                  Changes saved
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      );

    // ─── Navigation ─────────────────────────────────────────────────────
    case 'navbar':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <NavbarBrand>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>Brand</span>
            </NavbarBrand>
            <NavbarContent>
              <span style={{ fontSize: '10px', color: 'var(--color-fg-muted)' }}>
                Home &middot; About &middot; Contact
              </span>
            </NavbarContent>
          </div>
        </div>
      );
    case 'sidebar':
      return (
        <div style={{ ...wrap, width: '140px' }}>
          <Sidebar collapsed={false} style={{ height: '80px', position: 'relative' }}>
            <SidebarContent>
              <SidebarItem label="Dashboard" active />
              <SidebarItem label="Settings" />
              <SidebarItem label="Users" />
            </SidebarContent>
          </Sidebar>
        </div>
      );
    case 'breadcrumb':
      return (
        <div style={wrap}>
          <Breadcrumb>
            <BreadcrumbItem>
              <span>Home</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span>Products</span>
            </BreadcrumbItem>
            <BreadcrumbItem active>Detail</BreadcrumbItem>
          </Breadcrumb>
        </div>
      );
    case 'pagination':
      return (
        <div style={wrap}>
          <Pagination totalPages={5} currentPage={2} onPageChange={() => {}} size="sm" />
        </div>
      );
    case 'footer':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <Footer>
            <FooterSection title="Links">
              <span style={{ fontSize: '10px', color: 'var(--color-fg-muted)' }}>About</span>
            </FooterSection>
            <FooterBottom>
              <span style={{ fontSize: '9px', color: 'var(--color-fg-muted)' }}>
                &copy; 2026 Acme
              </span>
            </FooterBottom>
          </Footer>
        </div>
      );
    case 'mobile-nav':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '6px',
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            {['Home', 'Search', 'Profile'].map((l) => (
              <span key={l} style={{ fontSize: '10px', color: 'var(--color-fg-muted)' }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      );
    case 'drawer-nav':
      return (
        <div style={{ ...wrap, width: '120px' }}>
          <div
            style={{
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {['Dashboard', 'Settings', 'Help'].map((l) => (
              <span key={l} style={{ fontSize: '10px', color: 'var(--color-fg-secondary)' }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      );

    // ─── Data Display ───────────────────────────────────────────────────
    case 'datatable':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <div
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              fontSize: '10px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: 'var(--color-bg-elevated)',
                padding: '4px 6px',
                fontWeight: 600,
                borderBottom: '1px solid var(--color-border-default)',
                color: 'var(--color-fg-primary)',
              }}
            >
              <span>Name</span>
              <span>Role</span>
              <span>Status</span>
            </div>
            {[
              ['Alice', 'Admin', 'Active'],
              ['Bob', 'User', 'Pending'],
            ].map(([n, r, s]) => (
              <div
                key={n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '3px 6px',
                  color: 'var(--color-fg-secondary)',
                }}
              >
                <span>{n}</span>
                <span>{r}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'table':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <div
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              fontSize: '10px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'var(--color-bg-elevated)',
                padding: '4px 6px',
                fontWeight: 600,
                borderBottom: '1px solid var(--color-border-default)',
                color: 'var(--color-fg-primary)',
              }}
            >
              <span>Item</span>
              <span>Price</span>
            </div>
            {[
              ['Widget', '$9.99'],
              ['Gadget', '$19.99'],
            ].map(([i, p]) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '3px 6px',
                  color: 'var(--color-fg-secondary)',
                }}
              >
                <span>{i}</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'stat-card':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <StatCard title="Revenue" value="$12.4k" trend={{ value: 12, direction: 'up' }} />
        </div>
      );
    case 'kpi-card':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <KPICard title="Users" value="2,847" trend={{ value: 8.2, direction: 'up' }} />
        </div>
      );
    case 'progress-bar':
      return (
        <div style={{ ...wrap, ...flexCol, width: '180px' }}>
          <ProgressBar value={75} size="sm" />
          <ProgressBar value={45} size="sm" color="success" />
        </div>
      );
    case 'stats-bar':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <StatsBar
            stats={[
              { label: 'Users', value: '1.2k' },
              { label: 'Revenue', value: '$8k' },
              { label: 'Growth', value: '+12%' },
            ]}
          />
        </div>
      );

    // ─── Overlays ───────────────────────────────────────────────────────
    case 'drawer':
      return (
        <div style={{ ...wrap, width: '120px' }}>
          <div
            style={{
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              padding: '8px',
              height: '70px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>Drawer</div>
            <div style={{ fontSize: '10px', color: 'var(--color-fg-muted)' }}>
              Side panel content
            </div>
          </div>
        </div>
      );
    case 'popover':
      return (
        <div style={{ ...wrap, ...flexCol, alignItems: 'center', width: '180px' }}>
          <Button size="sm" variant="secondary">
            Trigger
          </Button>
          <Card padding="sm">
            <CardBody>
              <span style={{ fontSize: '10px' }}>Popover content</span>
            </CardBody>
          </Card>
        </div>
      );
    case 'command-palette':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Card padding="sm">
            <CardBody>
              <Input size="sm" placeholder="Type a command..." />
              <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--color-fg-muted)' }}>
                <div style={{ padding: '2px 0' }}>&#9654; Open file</div>
                <div style={{ padding: '2px 0' }}>&#9654; Search</div>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    case 'bottom-sheet':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <div
            style={{
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              border: '1px solid var(--color-border-default)',
              padding: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '4px',
                background: 'var(--color-fg-muted)',
                borderRadius: 'var(--radius-full)',
                margin: '0 auto 6px',
                opacity: 0.4,
              }}
            />
            <div
              style={{ fontSize: '10px', color: 'var(--color-fg-secondary)', textAlign: 'center' }}
            >
              Sheet content
            </div>
          </div>
        </div>
      );

    // ─── Layout ─────────────────────────────────────────────────────────
    case 'divider':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <Divider />
        </div>
      );
    case 'spacer':
      return (
        <div style={{ ...wrap, ...flexCol, width: '160px' }}>
          <div
            style={{
              fontSize: '10px',
              background: 'var(--color-bg-elevated)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}
          >
            Above
          </div>
          <Spacer size="md" />
          <div
            style={{
              fontSize: '10px',
              background: 'var(--color-bg-elevated)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}
          >
            Below
          </div>
        </div>
      );

    // ─── Marketing ──────────────────────────────────────────────────────
    case 'hero':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <Hero
            title="Welcome"
            subtitle="Get started today"
            actions={[{ label: 'Start', variant: 'primary' }]}
          />
        </div>
      );
    case 'feature-section':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <FeatureSection
            title="Features"
            features={[
              { title: 'Fast', description: 'Lightning speed' },
              { title: 'Secure', description: 'Built-in safety' },
            ]}
          />
        </div>
      );
    case 'testimonial':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <Testimonial quote="Great product!" author="Jane D." jobTitle="CEO" />
        </div>
      );
    case 'pricing-card':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <PricingCard
            title="Pro"
            price="$29"
            period="/mo"
            features={[{ text: 'Unlimited' }, { text: 'Support' }]}
            cta={{ label: 'Start' }}
          />
        </div>
      );
    case 'cta':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <CTA
            title="Get Started"
            subtitle="Try it free"
            actions={[{ label: 'Sign Up', variant: 'primary' }]}
          />
        </div>
      );
    case 'timeline':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Timeline
            items={[
              { title: 'Step 1', description: 'First' },
              { title: 'Step 2', description: 'Second' },
            ]}
          />
        </div>
      );
    case 'logo-cloud':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <LogoCloud
            logos={[
              {
                name: 'Acme',
                element: <span style={{ fontSize: '11px', fontWeight: 700 }}>Acme</span>,
              },
              {
                name: 'Corp',
                element: <span style={{ fontSize: '11px', fontWeight: 700 }}>Corp</span>,
              },
              {
                name: 'Inc',
                element: <span style={{ fontSize: '11px', fontWeight: 700 }}>Inc</span>,
              },
            ]}
          />
        </div>
      );

    // ─── E-commerce ─────────────────────────────────────────────────────
    case 'product-card':
      return (
        <div style={{ ...wrap, width: '150px' }}>
          <Card padding="sm">
            <CardBody>
              <div
                style={{
                  height: '32px',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '4px',
                }}
              />
              <div style={{ fontSize: '11px', fontWeight: 600 }}>Product</div>
              <div style={{ fontSize: '10px', color: 'var(--color-action-primary)' }}>$29.99</div>
            </CardBody>
          </Card>
        </div>
      );
    case 'cart-item':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px',
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600 }}>Item Name</div>
              <div style={{ fontSize: '10px', color: 'var(--color-fg-muted)' }}>
                Qty: 1 &middot; $19.99
              </div>
            </div>
          </div>
        </div>
      );
    case 'quantity-selector':
      return (
        <div style={wrap}>
          <QuantitySelector value={3} onChange={() => {}} size="sm" />
        </div>
      );
    case 'price-display':
      return (
        <div style={wrap}>
          <PriceDisplay amount={49.99} currency="USD" />
        </div>
      );
    case 'rating-stars':
      return (
        <div style={wrap}>
          <RatingStars value={4} max={5} size="sm" />
        </div>
      );

    // ─── Editorial ──────────────────────────────────────────────────────
    case 'article-layout':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <div
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '2px' }}>
              Article Title
            </div>
            <div style={{ fontSize: '9px', color: 'var(--color-fg-muted)', marginBottom: '4px' }}>
              By Author &middot; Jan 1, 2026
            </div>
            <Skeleton width="100%" height={8} />
            <Spacer size="xs" />
            <Skeleton width="90%" height={8} />
          </div>
        </div>
      );
    case 'pull-quote':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <PullQuote quote="Design is not just what it looks like." attribution="Steve Jobs" />
        </div>
      );
    case 'author-card':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <AuthorCard name="Jane Doe" bio="Senior Writer" />
        </div>
      );
    case 'related-posts':
      return (
        <div style={{ ...wrap, width: '220px' }}>
          <RelatedPosts
            posts={[
              { title: 'Getting Started', href: '#' },
              { title: 'Advanced Guide', href: '#' },
            ]}
          />
        </div>
      );
    case 'newsletter-signup':
      return (
        <div style={{ ...wrap, width: '200px' }}>
          <NewsletterSignup title="Subscribe" description="Get updates" onSubmit={() => {}} />
        </div>
      );

    // ─── Utilities ──────────────────────────────────────────────────────
    case 'scroll-area':
      return (
        <div style={{ ...wrap, width: '160px' }}>
          <ScrollArea style={{ height: '60px' }}>
            <div style={{ fontSize: '10px', color: 'var(--color-fg-secondary)' }}>
              <p>Scrollable content line 1</p>
              <p>Scrollable content line 2</p>
              <p>Scrollable content line 3</p>
              <p>Scrollable content line 4</p>
            </div>
          </ScrollArea>
        </div>
      );
    case 'collapsible':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Collapsible
            trigger={
              <Button size="sm" variant="secondary">
                Toggle
              </Button>
            }
            defaultOpen
          >
            <div style={{ fontSize: '10px', padding: '4px', color: 'var(--color-fg-secondary)' }}>
              Collapsible content
            </div>
          </Collapsible>
        </div>
      );
    case 'copy-button':
      return (
        <div style={wrap}>
          <CopyButton value="Copied text" size="sm" />
        </div>
      );
    case 'keyboard-shortcut':
      return (
        <div style={{ ...wrap, ...flexRow }}>
          <KeyboardShortcut keys={['Ctrl', 'C']} />
          <KeyboardShortcut keys={['Ctrl', 'V']} />
        </div>
      );
    case 'empty-state':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <EmptyState title="No items" description="Nothing here yet" />
        </div>
      );
    case 'carousel':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <Carousel>
            <div
              style={{
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-md)',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'var(--color-fg-muted)',
              }}
            >
              Slide 1
            </div>
          </Carousel>
        </div>
      );
    case 'image':
      return (
        <div style={{ ...wrap, width: '140px' }}>
          <Image
            src=""
            alt="Preview"
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'var(--color-fg-muted)',
                }}
              >
                Image
              </div>
            }
          />
        </div>
      );
    case 'date-picker':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <DatePicker size="sm" placeholder="Pick a date" />
        </div>
      );
    case 'file-upload':
      return (
        <div style={{ ...wrap, width: '180px' }}>
          <div
            style={{
              border: '2px dashed var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center',
              fontSize: '10px',
              color: 'var(--color-fg-muted)',
            }}
          >
            Drop files here
          </div>
        </div>
      );

    default:
      // Generic placeholder for components without a custom thumbnail
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'var(--color-fg-muted)',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          {'<'}
          {slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join('')}
          {' />'}
        </div>
      );
  }
}

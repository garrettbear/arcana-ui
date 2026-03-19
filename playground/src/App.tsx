import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  ArticleLayout,
  AspectRatio,
  AuthorCard,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  BottomSheet,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CTA,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Carousel,
  CartItem,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  CommandPalette,
  Container,
  CopyButton,
  DataTable,
  DatePicker,
  Divider,
  Drawer,
  DrawerNav,
  EmptyState,
  ErrorBoundary,
  FeatureSection,
  FileUpload,
  Footer,
  FooterBottom,
  FooterLink,
  FooterSection,
  Form,
  FormErrorMessage,
  FormField,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Hero,
  Image,
  Input,
  KPICard,
  KeyboardShortcut,
  LogoCloud,
  MobileNav,
  Modal,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NewsletterSignup,
  Pagination,
  Popover,
  PriceDisplay,
  PricingCard,
  ProductCard,
  ProgressBar,
  PullQuote,
  QuantitySelector,
  Radio,
  RadioGroup,
  RatingStars,
  RelatedPosts,
  ScrollArea,
  Select,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  StatCard,
  StatsBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Testimonial,
  Textarea,
  Timeline,
  ToastProvider,
  Toggle,
  useHotkey,
  useToast,
} from '@arcana-ui/core';
import type { ColumnDef, CommandItem } from '@arcana-ui/core';
import type React from 'react';
import { useState } from 'react';
import styles from './App.module.css';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { TokenEditor } from './components/TokenEditor';
import { PRESETS, type PresetId, applyPreset } from './utils/presets';

// ─── Toast Demo ───────────────────────────────────────────────────────────────

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className={styles.demoFlex}>
      <Button
        size="sm"
        onClick={() => toast({ title: 'Changes saved', description: 'Your profile was updated.' })}
      >
        Default
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({ title: 'Deployed!', description: 'v2.4.1 is now live.', variant: 'success' })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Usage limit approaching',
            description: '80% of your monthly quota used.',
            variant: 'warning',
          })
        }
      >
        Warning
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() =>
          toast({
            title: 'Build failed',
            description: 'Check the logs for details.',
            variant: 'error',
          })
        }
      >
        Error
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          toast({
            title: 'File deleted',
            description: 'design-system.fig was removed.',
            action: { label: 'Undo', onClick: () => console.log('Undo!') },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}

// ─── Overview Dashboard ───────────────────────────────────────────────────────

function OverviewSection() {
  const [overviewTab, setOverviewTab] = useState('overview');
  const [overviewToggle, setOverviewToggle] = useState(true);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Theme Showcase</h2>
      <p className={styles.sectionDesc}>
        A curated gallery of Arcana UI's best components rendered with the current theme. Adjust
        tokens in the editor to see everything update in real-time.
      </p>

      {/* Hero */}
      <div className={styles.dashSection}>
        <Hero
          variant="centered"
          headline="Ship beautiful interfaces at the speed of thought"
          subheadline="Arcana UI is a token-driven design system built for AI agents. One JSON config controls your entire design — colors, typography, spacing, motion. 60+ production-grade components."
          primaryCTA={{ label: 'Get Started', onClick: () => {} }}
          secondaryCTA={{ label: 'View on GitHub', onClick: () => {} }}
        />
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Components" value="60+" trend={{ value: 12, direction: 'up' }} />
        <StatCard label="Theme Presets" value="6" trend={{ value: 8, direction: 'up' }} prefix="" />
        <StatCard label="Design Tokens" value="2,681" trend={{ value: 24, direction: 'up' }} />
        <StatCard label="WCAG Score" value="AA" />
      </div>

      {/* Navbar sample */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Navigation</h3>
        <Navbar>
          <NavbarBrand>
            <span
              style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}
            >
              Lumina
            </span>
          </NavbarBrand>
          <NavbarContent>
            {[
              { label: 'Dashboard', href: '#' },
              { label: 'Analytics', href: '#' },
              { label: 'Users', href: '#' },
              { label: 'Settings', href: '#' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {item.label}
              </a>
            ))}
          </NavbarContent>
          <NavbarActions>
            <Button size="sm">New Project</Button>
          </NavbarActions>
        </Navbar>
      </div>

      {/* Cards + Form side by side */}
      <div className={styles.twoCol}>
        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Cards</h3>
          <Stack gap={4}>
            <Card>
              <CardHeader title="Project Status" subtitle="Last 30 days" />
              <CardBody>
                <ProgressBar value={72} color="primary" showValue />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-fg-secondary)',
                  }}
                >
                  <span>72% complete</span>
                  <span>28 days remaining</span>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <Avatar name="Sarah Chen" size="lg" />
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>Sarah Chen</div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-fg-secondary)',
                      }}
                    >
                      Engineering Lead · Joined 2024
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Stack>
        </div>

        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Form Controls</h3>
          <Stack gap={3}>
            <Input label="Email" placeholder="you@company.com" />
            <Input label="Project Name" placeholder="My new project" />
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
            <Toggle
              label="Send notifications"
              checked={overviewToggle}
              onChange={setOverviewToggle}
            />
            <Button>Create Project</Button>
          </Stack>
        </div>
      </div>

      {/* Buttons showcase */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Buttons & Badges</h3>
        <div className={styles.demoFlex} style={{ flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Loading</Button>
        </div>
        <div
          className={styles.demoFlex}
          style={{ flexWrap: 'wrap', marginTop: 'var(--spacing-sm)' }}
        >
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Tabs + Accordion */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Tabs & Accordion</h3>
        <div className={styles.twoCol}>
          <Tabs value={overviewTab} onChange={setOverviewTab}>
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="analytics">Analytics</Tab>
              <Tab value="settings">Settings</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="overview">
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-fg-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  A comprehensive view of your project metrics, team activity, and deployment
                  status. Monitor key performance indicators in real-time.
                </p>
              </TabPanel>
              <TabPanel value="analytics">
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-fg-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  Deep analytics for user engagement, conversion funnels, and retention metrics
                  across all your projects.
                </p>
              </TabPanel>
              <TabPanel value="settings">
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-fg-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  Configure notifications, integrations, API keys, and team permissions from one
                  central location.
                </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Accordion type="single" defaultValue="a1">
            <AccordionItem value="a1">
              <AccordionTrigger>What is Arcana UI?</AccordionTrigger>
              <AccordionContent>
                A token-driven design system that lets AI agents build production-grade interfaces.
                One JSON file controls your entire visual identity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a2">
              <AccordionTrigger>How many components?</AccordionTrigger>
              <AccordionContent>
                60+ components across navigation, forms, data display, overlays, feedback,
                marketing, e-commerce, and editorial categories.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a3">
              <AccordionTrigger>How does theming work?</AccordionTrigger>
              <AccordionContent>
                Each theme is a single JSON file defining a three-tier token hierarchy: primitive
                values, semantic mappings, and component overrides. Switch themes by changing one
                attribute.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Pricing preview */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Pricing</h3>
        <div className={styles.threeCol}>
          <PricingCard
            name="Starter"
            price={0}
            period="month"
            description="For side projects"
            features={['5 projects', '1 team member', 'Basic analytics', 'Community support']}
            cta={{ label: 'Get Started', onClick: () => {} }}
          />
          <PricingCard
            name="Pro"
            price={29}
            period="month"
            description="For growing teams"
            features={[
              'Unlimited projects',
              '10 team members',
              'Advanced analytics',
              'Priority support',
              'Custom domains',
            ]}
            cta={{ label: 'Start Free Trial', onClick: () => {} }}
            popular
          />
          <PricingCard
            name="Enterprise"
            price={99}
            period="month"
            description="For organizations"
            features={[
              'Everything in Pro',
              'Unlimited members',
              'SSO & SAML',
              'Dedicated support',
              'SLA guarantee',
              'Custom integrations',
            ]}
            cta={{ label: 'Contact Sales', onClick: () => {} }}
          />
        </div>
      </div>

      {/* Alerts */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Feedback</h3>
        <Stack gap={3}>
          <Alert variant="success" title="Deployment successful">
            Version 2.4.1 is now live in production.
          </Alert>
          <Alert variant="warning" title="Usage limit approaching">
            You have used 80% of your monthly API quota.
          </Alert>
          <Alert variant="error" title="Build failed">
            TypeScript compilation error in src/auth.ts — check the logs.
          </Alert>
          <Alert variant="info" title="Scheduled maintenance">
            A brief maintenance window is planned for Saturday 2am–4am UTC.
          </Alert>
        </Stack>
      </div>
    </div>
  );
}

// ─── Components Section ───────────────────────────────────────────────────────

function ComponentsSection() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [radioValue, setRadioValue] = useState('react');
  const [toggleOn, setToggleOn] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState('overview');

  return (
    <div>
      <h2 className={styles.sectionTitle}>Core Components</h2>
      <p className={styles.sectionDesc}>
        Buttons, badges, avatars, alerts, modals, tabs, form controls, and accordions.
      </p>
      {/* Buttons */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Buttons</h3>
        <p className={styles.sectionSubtitle}>Variants, sizes, and states</p>

        <div className={styles.demoRow}>
          <div className={styles.demoRowLabel}>Variants</div>
          <div className={styles.demoFlex}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Danger</Button>
          </div>
        </div>

        <div className={styles.demoRow}>
          <div className={styles.demoRowLabel}>Sizes</div>
          <div className={styles.demoFlex}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading size="md">
              Loading
            </Button>
            <Button disabled size="md">
              Disabled
            </Button>
          </div>
        </div>
      </div>

      {/* Badges & Avatars */}
      <div className={styles.twoCol}>
        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Badges</h3>
          <p className={styles.sectionSubtitle}>Status indicators</p>
          <div className={styles.demoFlex} style={{ marginBottom: 12 }}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className={styles.demoFlex}>
            <Badge dot variant="success">
              Online
            </Badge>
            <Badge dot variant="warning">
              Away
            </Badge>
            <Badge dot variant="error">
              Offline
            </Badge>
            <Badge dot>Unknown</Badge>
          </div>
        </div>

        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Avatars</h3>
          <p className={styles.sectionSubtitle}>User representations</p>
          <div className={styles.demoFlex} style={{ marginBottom: 12 }}>
            <Avatar size="xs" name="A" />
            <Avatar size="sm" name="BC" />
            <Avatar size="md" name="Carlos" />
            <Avatar size="lg" name="Diana" />
            <Avatar size="xl" name="Evan" />
          </div>
          <AvatarGroup max={4}>
            <Avatar name="Alice Z" size="md" />
            <Avatar name="Bob S" size="md" />
            <Avatar name="Carlos R" size="md" />
            <Avatar name="Diana P" size="md" />
            <Avatar name="Evan W" size="md" />
            <Avatar name="Fiona X" size="md" />
          </AvatarGroup>
        </div>
      </div>

      {/* Alerts */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Alerts</h3>
        <p className={styles.sectionSubtitle}>Feedback for actions and system states</p>
        <Stack gap={3}>
          <Alert variant="info" title="New release available">
            Arcana UI v2.0 introduces the token editor and accessibility panel.
          </Alert>
          <Alert variant="success" title="Deployment successful">
            Your app is live at arcana-ui.vercel.app — took 42 seconds.
          </Alert>
          <Alert variant="warning" title="Approaching rate limit">
            87% of your API quota used. Upgrade to avoid interruptions.
          </Alert>
          <Alert variant="error" title="Build failed" onClose={() => {}}>
            TypeScript error in packages/core/src/Button/Button.tsx:47
          </Alert>
        </Stack>
      </div>

      {/* Modal */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Modal</h3>
        <p className={styles.sectionSubtitle}>Dialogs for confirmations and forms</p>
        <Button onClick={() => setModalOpen(true)}>Open Delete Dialog</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Delete Project?"
          description="This will permanently delete Project Alpha and all associated data."
          footer={
            <HStack gap={2} justify="flex-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setModalOpen(false)}>
                Delete
              </Button>
            </HStack>
          }
        >
          <p
            style={{
              margin: 0,
              color: 'var(--color-fg-secondary)',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            Deleting <strong>Project Alpha</strong> will remove:
          </p>
          <ul
            style={{
              margin: '8px 0 0',
              paddingLeft: '20px',
              color: 'var(--color-fg-secondary)',
              fontSize: '14px',
              lineHeight: 1.8,
            }}
          >
            <li>12 open issues</li>
            <li>3 active branches</li>
            <li>47 commits</li>
          </ul>
        </Modal>
      </div>

      {/* Toasts */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Toast Notifications</h3>
        <p className={styles.sectionSubtitle}>Ephemeral messages for feedback</p>
        <ToastDemo />
      </div>

      {/* Tabs */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Tabs</h3>
        <p className={styles.sectionSubtitle}>Content organization and navigation</p>
        <Stack gap={6}>
          <Tabs value={tabValue} onChange={setTabValue}>
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="analytics">Analytics</Tab>
              <Tab value="settings">Settings</Tab>
              <Tab value="billing" disabled>
                Billing
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="overview">
                <div
                  style={{
                    padding: '16px 0',
                    color: 'var(--color-fg-secondary)',
                    fontSize: '14px',
                  }}
                >
                  Overview: showing project health, recent commits, and team activity.
                </div>
              </TabPanel>
              <TabPanel value="analytics">
                <div
                  style={{
                    padding: '16px 0',
                    color: 'var(--color-fg-secondary)',
                    fontSize: '14px',
                  }}
                >
                  Analytics: page views, conversion funnel, error rates by endpoint.
                </div>
              </TabPanel>
              <TabPanel value="settings">
                <div
                  style={{
                    padding: '16px 0',
                    color: 'var(--color-fg-secondary)',
                    fontSize: '14px',
                  }}
                >
                  Settings: environment variables, deploy hooks, collaborator access.
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Tabs defaultValue="all" variant="pills">
            <TabList>
              <Tab value="all">All</Tab>
              <Tab value="open">Open</Tab>
              <Tab value="closed">Closed</Tab>
              <Tab value="draft">Draft</Tab>
            </TabList>
          </Tabs>
        </Stack>
      </div>

      {/* Controls */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Form Controls</h3>
        <p className={styles.sectionSubtitle}>Checkboxes, radios, and toggles</p>
        <div className={styles.threeCol}>
          <Stack gap={3}>
            <Checkbox
              label="Enable dark mode"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <Checkbox
              label="Email notifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <Checkbox
              label="Weekly digest"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
            />
            <Checkbox label="Disabled option" disabled checked={false} onChange={() => {}} />
            <Checkbox
              label="Two-factor auth"
              description="Add extra security to your account."
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
            />
          </Stack>
          <RadioGroup
            name="framework"
            label="Preferred framework"
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { value: 'react', label: 'React', description: 'Meta' },
              { value: 'vue', label: 'Vue', description: 'Community' },
              { value: 'svelte', label: 'Svelte', description: 'Rich Harris' },
              { value: 'solid', label: 'SolidJS', description: 'Ryan Carniato' },
            ]}
          />
          <Stack gap={4}>
            <Toggle label="Auto-deploy" checked={toggleOn} onChange={setToggleOn} />
            <Toggle label="Email alerts" checked={emailAlerts} onChange={setEmailAlerts} />
            <Toggle label="Beta features" checked={betaFeatures} onChange={setBetaFeatures} />
            <Toggle
              size="sm"
              label="Preview mode"
              checked={previewMode}
              onChange={setPreviewMode}
            />
          </Stack>
        </div>
      </div>

      {/* Accordion */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Accordion</h3>
        <p className={styles.sectionSubtitle}>Collapsible content sections</p>
        <div className={styles.twoCol}>
          <Accordion type="single" defaultValue="q1">
            <AccordionItem value="q1">
              <AccordionTrigger>What is Arcana UI?</AccordionTrigger>
              <AccordionContent>
                An AI-first design system with a token-driven architecture. Built for machines to
                read and humans to love.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How does theme switching work?</AccordionTrigger>
              <AccordionContent>
                Set{' '}
                <code
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    background: 'var(--color-bg-surface)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  data-theme
                </code>{' '}
                on{' '}
                <code
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    background: 'var(--color-bg-surface)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  document.documentElement
                </code>
                , or override CSS custom properties via JS for custom themes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. WAI-ARIA patterns, keyboard navigation, and focus management built-in. Check
                the A11y panel on the right for live analysis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" defaultValue={['f1']}>
            <AccordionItem value="f1">
              <AccordionTrigger>Can I export my theme?</AccordionTrigger>
              <AccordionContent>
                Yes — use the "Export JSON" button in the Token Editor to copy the current theme as
                a flat CSS variable map.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="f2">
              <AccordionTrigger>TypeScript support?</AccordionTrigger>
              <AccordionContent>
                Full TypeScript support with exported prop interfaces and strict typing throughout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="f3" disabled>
              <AccordionTrigger>Coming soon</AccordionTrigger>
              <AccordionContent>This item is disabled.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ─── Forms Section ────────────────────────────────────────────────────────────

function FormsSection() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState<string | string[]>('');
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['email']);
  const [radioValue, setRadioValue] = useState('starter');
  const [cardRadio, setCardRadio] = useState('monthly');
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Form Components</h2>
      <p className={styles.sectionDesc}>
        Inputs, selects, checkboxes, radios, toggles, date pickers, and file uploads.
      </p>
      <div className={styles.twoCol}>
        {/* Create Account Form */}
        <Card>
          <CardHeader title="Create Account" description="Join 1,284 teams using Arcana UI." />
          <CardBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Stack gap={4}>
                <FormField isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input
                    placeholder="Jane Smith"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <FormHelperText>Used on your public profile.</FormHelperText>
                </FormField>
                <FormField isRequired isInvalid>
                  <FormLabel>Work email</FormLabel>
                  <Input type="email" placeholder="jane@acme.com" />
                  <FormErrorMessage>Please enter a valid work email address.</FormErrorMessage>
                </FormField>
                <FormField>
                  <Select
                    label="Team size"
                    placeholder="How many engineers?"
                    value={selectValue}
                    onChange={setSelectValue}
                    options={[
                      { value: '1', label: 'Just me' },
                      { value: '2-5', label: '2–5' },
                      { value: '6-20', label: '6–20' },
                      { value: '21+', label: '21+' },
                    ]}
                    fullWidth
                  />
                </FormField>
                <FormField>
                  <FormLabel>Tell us about your project</FormLabel>
                  <Textarea
                    placeholder="We're building a..."
                    autoResize
                    showCount
                    maxLength={200}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <Checkbox
                    label="I agree to the Terms of Service and Privacy Policy"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                </FormField>
                <HStack gap={2} justify="flex-end">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!agreed}>
                    Create Account
                  </Button>
                </HStack>
              </Stack>
            </Form>
          </CardBody>
        </Card>

        {/* Enhanced Form Controls */}
        <Stack gap={4}>
          <Card>
            <CardHeader title="Select Variants" description="Single, multi, searchable, grouped" />
            <CardBody>
              <Stack gap={4}>
                <Select
                  label="Searchable"
                  placeholder="Search countries..."
                  searchable
                  clearable
                  options={[
                    { value: 'us', label: 'United States', group: 'Americas' },
                    { value: 'ca', label: 'Canada', group: 'Americas' },
                    { value: 'mx', label: 'Mexico', group: 'Americas' },
                    { value: 'uk', label: 'United Kingdom', group: 'Europe' },
                    { value: 'de', label: 'Germany', group: 'Europe' },
                    { value: 'fr', label: 'France', group: 'Europe' },
                    { value: 'jp', label: 'Japan', group: 'Asia' },
                    { value: 'kr', label: 'South Korea', group: 'Asia' },
                  ]}
                  fullWidth
                />
                <Select
                  label="Multi-select"
                  placeholder="Select skills..."
                  multiple
                  value={multiSelect}
                  onChange={(v) => setMultiSelect(v as string[])}
                  options={[
                    { value: 'react', label: 'React' },
                    { value: 'ts', label: 'TypeScript' },
                    { value: 'node', label: 'Node.js' },
                    { value: 'python', label: 'Python' },
                    { value: 'go', label: 'Go' },
                  ]}
                  fullWidth
                />
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Checkbox & Radio" />
            <CardBody>
              <Stack gap={4}>
                <CheckboxGroup
                  label="Notifications"
                  options={[
                    { value: 'email', label: 'Email', description: 'Get notified by email' },
                    { value: 'sms', label: 'SMS', description: 'Text message alerts' },
                    { value: 'push', label: 'Push', description: 'Browser notifications' },
                  ]}
                  value={checkboxValues}
                  onChange={setCheckboxValues}
                />
                <RadioGroup
                  name="plan"
                  label="Select plan"
                  variant="card"
                  options={[
                    { value: 'monthly', label: 'Monthly', description: '$9/month' },
                    { value: 'yearly', label: 'Yearly', description: '$89/year (save 18%)' },
                  ]}
                  value={cardRadio}
                  onChange={setCardRadio}
                />
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </div>

      {/* Second row */}
      <div className={styles.twoCol} style={{ marginTop: 'var(--spacing-lg)' }}>
        <Card>
          <CardHeader title="Toggle, Date & File" />
          <CardBody>
            <Stack gap={4}>
              <Toggle label="Dark mode" checked={toggleA} onChange={setToggleA} />
              <Toggle
                label="Notifications"
                description="Receive weekly digest"
                checked={toggleB}
                onChange={setToggleB}
              />
              <DatePicker
                label="Start date"
                value={date}
                onChange={setDate}
                clearable
                helperText="When should the project begin?"
              />
              <FileUpload
                label="Attachments"
                description="PNG, JPG, PDF up to 10MB"
                accept="image/*,.pdf"
                multiple
                maxSize={10 * 1024 * 1024}
                onChange={setUploadedFiles}
              />
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Input Variants" />
          <CardBody>
            <Stack gap={4}>
              <Input label="Default" placeholder="Enter text..." />
              <Input
                label="With error"
                placeholder="you@email.com"
                type="email"
                error="Invalid email format."
              />
              <Input label="Disabled" value="Read-only value" disabled />
              <RadioGroup
                name="size"
                label="Team size"
                orientation="horizontal"
                options={[
                  { value: 'starter', label: '1–5' },
                  { value: 'growth', label: '6–20' },
                  { value: 'scale', label: '21–100' },
                  { value: 'enterprise', label: '100+' },
                ]}
                value={radioValue}
                onChange={setRadioValue}
              />
            </Stack>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// ─── Data Section ─────────────────────────────────────────────────────────────

const TEAM_DATA = [
  {
    name: 'Alice Zhao',
    role: 'Senior Engineer',
    status: 'Active',
    projects: 4,
    joined: 'Jan 2024',
    avatar: 'Alice Zhao',
  },
  {
    name: 'Bob Smith',
    role: 'Product Designer',
    status: 'Active',
    projects: 7,
    joined: 'Mar 2024',
    avatar: 'Bob Smith',
  },
  {
    name: 'Carlos Rivera',
    role: 'Engineering Manager',
    status: 'Away',
    projects: 12,
    joined: 'Feb 2024',
    avatar: 'Carlos Rivera',
  },
  {
    name: 'Diana Prince',
    role: 'Frontend Engineer',
    status: 'Inactive',
    projects: 2,
    joined: 'Dec 2023',
    avatar: 'Diana Prince',
  },
  {
    name: 'Evan Walsh',
    role: 'DevOps Engineer',
    status: 'Active',
    projects: 6,
    joined: 'Apr 2024',
    avatar: 'Evan Walsh',
  },
  {
    name: 'Fiona Xu',
    role: 'QA Engineer',
    status: 'Active',
    projects: 3,
    joined: 'May 2024',
    avatar: 'Fiona Xu',
  },
];

function DataSection() {
  const [sortKey, setSortKey] = useState<string | null>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...TEAM_DATA].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey as keyof typeof a];
    const bv = b[sortKey as keyof typeof b];
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div>
      <h2 className={styles.sectionTitle}>Data Display</h2>
      <p className={styles.sectionDesc}>
        Tables, data grids, stat cards, progress indicators, and KPI visualizations.
      </p>
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Team Members</h3>
        <p className={styles.sectionSubtitle}>Manage access and roles across your organization</p>
        <Table striped hoverable>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={sortKey === 'name' ? sortDir : undefined}
                onSort={() => handleSort('name')}
              >
                Member
              </TableHead>
              <TableHead
                sortable
                sortDirection={sortKey === 'role' ? sortDir : undefined}
                onSort={() => handleSort('role')}
              >
                Role
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                sortable
                sortDirection={sortKey === 'projects' ? sortDir : undefined}
                onSort={() => handleSort('projects')}
              >
                Projects
              </TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((member) => (
              <TableRow key={member.name}>
                <TableCell>
                  <HStack gap={2}>
                    <Avatar name={member.avatar} size="sm" />
                    <span style={{ fontWeight: 500 }}>{member.name}</span>
                  </HStack>
                </TableCell>
                <TableCell style={{ color: 'var(--color-fg-secondary)' }}>{member.role}</TableCell>
                <TableCell>
                  <Badge
                    dot
                    variant={
                      member.status === 'Active'
                        ? 'success'
                        : member.status === 'Away'
                          ? 'warning'
                          : 'secondary'
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell style={{ color: 'var(--color-fg-secondary)', textAlign: 'center' }}>
                  {member.projects}
                </TableCell>
                <TableCell style={{ color: 'var(--color-fg-muted)' }}>{member.joined}</TableCell>
                <TableCell>
                  <HStack gap={1}>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost">
                      <span style={{ color: 'var(--color-status-error)' }}>Remove</span>
                    </Button>
                  </HStack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty states */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Empty States</h3>
        <p className={styles.sectionSubtitle}>Graceful handling of no-content scenarios</p>
        <div className={styles.twoCol}>
          <Card>
            <CardBody>
              <EmptyState
                icon={
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect
                      x="6"
                      y="10"
                      width="28"
                      height="22"
                      rx="3"
                      stroke="var(--color-fg-muted)"
                      strokeWidth="2"
                    />
                    <path
                      d="M13 18h14M13 24h8"
                      stroke="var(--color-fg-muted)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="29" cy="11" r="5" fill="var(--color-status-error)" />
                    <path
                      d="M29 8.5v3M29 13v.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="No issues found"
                description="Your project is issue-free. Keep up the good work!"
                action={
                  <Button variant="secondary" size="sm">
                    Create an issue
                  </Button>
                }
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <EmptyState
                size="sm"
                title="No results for 'arcana'"
                description="Try a different search term or clear your filters."
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* DataTable Demo */}
      <DataTableDemo />

      {/* StatCard Demo */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Stat Cards</h3>
        <p className={styles.sectionSubtitle}>Key metrics at a glance with trend indicators</p>
        <div className={styles.statsGrid}>
          <StatCard
            value="142,580"
            label="Revenue"
            prefix="$"
            trend={{ value: 12.3, direction: 'up' }}
            comparison="vs last month"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            }
          />
          <StatCard
            value="8,492"
            label="Active Users"
            trend={{ value: 5.7, direction: 'up' }}
            comparison="vs last month"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
          />
          <StatCard
            value="3.2"
            label="Conversion Rate"
            suffix="%"
            trend={{ value: 0.4, direction: 'down' }}
            comparison="vs last month"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <StatCard
            value="1.2"
            label="Page Load"
            suffix="s"
            trend={{ value: 15.8, direction: 'down' }}
            comparison="faster than last week"
            variant="compact"
          />
        </div>
      </div>

      {/* ProgressBar Demo */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Progress Bars</h3>
        <p className={styles.sectionSubtitle}>
          Completion and loading indicators in multiple styles
        </p>
        <Stack gap={4}>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Default sizes
            </p>
            <Stack gap={2}>
              <ProgressBar value={75} size="sm" label="Small" />
              <ProgressBar value={60} size="md" label="Medium" showValue />
              <ProgressBar value={45} size="lg" label="Large" showValue />
            </Stack>
          </div>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Colors
            </p>
            <Stack gap={2}>
              <ProgressBar value={80} color="primary" label="Primary" showValue />
              <ProgressBar value={65} color="success" label="Success" showValue />
              <ProgressBar value={45} color="warning" label="Warning" showValue />
              <ProgressBar value={25} color="error" label="Error" showValue />
            </Stack>
          </div>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Variants
            </p>
            <Stack gap={2}>
              <ProgressBar value={70} variant="striped" label="Striped" showValue />
              <ProgressBar value={55} variant="animated" label="Animated" showValue />
              <ProgressBar value={0} indeterminate label="Loading data..." />
            </Stack>
          </div>
        </Stack>
      </div>

      {/* KPICard Demo */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>KPI Cards</h3>
        <p className={styles.sectionSubtitle}>Metrics with sparkline trend visualizations</p>
        <div className={styles.statsGrid}>
          <KPICard
            value="142,580"
            label="Revenue"
            prefix="$"
            trend={{ value: 12.3, direction: 'up' }}
            data={[95, 102, 98, 115, 120, 118, 130, 125, 135, 142]}
            period="Last 30 days"
            target={{ value: 130, label: '$130K' }}
          />
          <KPICard
            value="8,492"
            label="Active Users"
            trend={{ value: 5.7, direction: 'up' }}
            data={[7200, 7400, 7100, 7800, 8000, 7900, 8100, 8300, 8200, 8492]}
            period="Last 30 days"
          />
          <KPICard
            value="3.2"
            label="Conversion Rate"
            suffix="%"
            trend={{ value: 0.4, direction: 'down' }}
            data={[3.8, 3.6, 3.5, 3.4, 3.3, 3.4, 3.2, 3.3, 3.1, 3.2]}
            period="Last 7 days"
          />
          <KPICard
            value="1.2"
            label="Page Load"
            suffix="s"
            trend={{ value: 15.8, direction: 'down' }}
            data={[1.8, 1.7, 1.5, 1.4, 1.3, 1.4, 1.3, 1.2, 1.3, 1.2]}
            period="Last 7 days"
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
}

// ─── DataTable Demo ──────────────────────────────────────────────────────────

interface LuminaUser {
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const LUMINA_USERS: LuminaUser[] = [
  {
    name: 'Sarah Chen',
    email: 'sarah@lumina.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 min ago',
  },
  {
    name: 'James Wilson',
    email: 'james@lumina.io',
    role: 'Editor',
    status: 'Active',
    lastActive: '15 min ago',
  },
  {
    name: 'Maya Patel',
    email: 'maya@lumina.io',
    role: 'Viewer',
    status: 'Inactive',
    lastActive: '3 days ago',
  },
  {
    name: 'Alex Kim',
    email: 'alex@lumina.io',
    role: 'Editor',
    status: 'Active',
    lastActive: '1 hr ago',
  },
  {
    name: "Liam O'Brien",
    email: 'liam@lumina.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '5 min ago',
  },
  {
    name: 'Zoe Nakamura',
    email: 'zoe@lumina.io',
    role: 'Viewer',
    status: 'On Leave',
    lastActive: '1 week ago',
  },
  {
    name: 'Carlos Rivera',
    email: 'carlos@lumina.io',
    role: 'Editor',
    status: 'Active',
    lastActive: '30 min ago',
  },
  {
    name: 'Ava Thompson',
    email: 'ava@lumina.io',
    role: 'Viewer',
    status: 'Active',
    lastActive: '2 hr ago',
  },
  {
    name: 'Noah Fischer',
    email: 'noah@lumina.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '10 min ago',
  },
  {
    name: 'Emma Davis',
    email: 'emma@lumina.io',
    role: 'Editor',
    status: 'Inactive',
    lastActive: '5 days ago',
  },
  {
    name: 'Oscar Martinez',
    email: 'oscar@lumina.io',
    role: 'Viewer',
    status: 'Active',
    lastActive: '45 min ago',
  },
  {
    name: 'Isla Murray',
    email: 'isla@lumina.io',
    role: 'Editor',
    status: 'Active',
    lastActive: '20 min ago',
  },
];

const LUMINA_COLUMNS: ColumnDef<LuminaUser>[] = [
  { key: 'name', header: 'Name', sticky: 'left' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Badge
        dot
        variant={value === 'Active' ? 'success' : value === 'Inactive' ? 'secondary' : 'warning'}
      >
        {String(value)}
      </Badge>
    ),
  },
  { key: 'lastActive', header: 'Last Active', align: 'right' },
];

function DataTableDemo() {
  return (
    <div className={styles.dashSection}>
      <h3 className={styles.groupTitle}>DataTable</h3>
      <p className={styles.sectionSubtitle}>
        Full-featured data table with sorting, filtering, selection, and pagination
      </p>
      <DataTable
        data={LUMINA_USERS}
        columns={LUMINA_COLUMNS}
        sortable
        filterable
        selectable
        pagination={{ pageSize: 5 }}
        striped
        hoverable
        emptyState={
          <EmptyState
            size="sm"
            title="No users found"
            description="Try adjusting your search or filters."
          />
        }
      />
    </div>
  );
}

// ─── Layout Section ───────────────────────────────────────────────────────────

function LayoutSection() {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Layout Utilities</h2>
      <p className={styles.sectionDesc}>
        Stack, grid, container, divider, spacer, and aspect ratio — composable layout building
        blocks.
      </p>
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Stack, HStack & Grid</h3>

        <div className={styles.twoCol} style={{ marginBottom: 24 }}>
          <div>
            <div className={styles.demoRowLabel}>Stack (vertical, gap-2)</div>
            <Stack gap={2}>
              {['API Server', 'Database', 'Cache Layer', 'CDN'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--color-fg-secondary)',
                  }}
                >
                  {item}
                </div>
              ))}
            </Stack>
          </div>
          <div>
            <div className={styles.demoRowLabel}>HStack (horizontal, gap-2)</div>
            <HStack gap={2} style={{ flexWrap: 'wrap' }}>
              {['Design', 'Engineering', 'Product', 'QA'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--color-action-primary)',
                    color: 'var(--color-fg-on-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                >
                  {item}
                </div>
              ))}
            </HStack>
          </div>
        </div>

        <div className={styles.demoRowLabel}>Grid (3 columns)</div>
        <Grid columns={3} gap={3}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--color-fg-secondary)',
              }}
            >
              Cell {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

// ─── Feedback Section ─────────────────────────────────────────────────────────

function BuggyComponent(): React.JSX.Element {
  throw new Error('This component crashed intentionally!');
}

function FeedbackSection() {
  const [showBuggy, setShowBuggy] = useState(false);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Feedback Components</h2>
      <p className={styles.sectionDesc}>
        Banners, skeletons, spinners, empty states, and error boundaries for loading and error UX.
      </p>
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Banners</h3>
        <p className={styles.sectionSubtitle}>Full-width notification bars</p>
        <Stack gap={2}>
          <Banner variant="info" title="Update available">
            A new version of Arcana UI is ready to install.
          </Banner>
          <Banner variant="success">Your changes have been saved successfully.</Banner>
          <Banner variant="warning" dismissible>
            Your trial expires in 3 days. Upgrade now.
          </Banner>
          <Banner
            variant="error"
            title="Payment failed"
            action={
              <Button size="sm" variant="secondary">
                Retry
              </Button>
            }
          >
            Unable to process your payment.
          </Banner>
        </Stack>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Skeleton</h3>
        <p className={styles.sectionSubtitle}>Loading placeholders</p>
        <div className={styles.twoCol}>
          <Card>
            <CardBody>
              <HStack gap={3}>
                <Skeleton variant="circular" />
                <Stack gap={2} style={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Stack>
              </HStack>
              <Spacer size="md" />
              <Skeleton variant="text" lines={3} />
              <Spacer size="md" />
              <Skeleton variant="rectangular" height="var(--spacing-24)" />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stack gap={3}>
                <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>
                  Spinner Sizes
                </p>
                <HStack gap={4}>
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </HStack>
                <Divider label="Layout Utilities" />
                <HStack gap={4}>
                  <AspectRatio
                    ratio="square"
                    style={{
                      width: 'var(--spacing-16)',
                      background: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-fg-muted)',
                      }}
                    >
                      1:1
                    </div>
                  </AspectRatio>
                  <AspectRatio
                    ratio="video"
                    style={{
                      width: 'var(--spacing-24)',
                      background: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-fg-muted)',
                      }}
                    >
                      16:9
                    </div>
                  </AspectRatio>
                </HStack>
              </Stack>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Error Boundary</h3>
        <p className={styles.sectionSubtitle}>Graceful error handling with recovery</p>
        <Card>
          <CardBody>
            <ErrorBoundary
              fallback={(error, reset) => (
                <Stack gap={3} style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <p
                    style={{
                      color: 'var(--color-status-error-fg)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {error.message}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      reset();
                      setShowBuggy(false);
                    }}
                  >
                    Recover
                  </Button>
                </Stack>
              )}
            >
              {showBuggy ? (
                <BuggyComponent />
              ) : (
                <Stack gap={3} style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <p style={{ margin: 0, color: 'var(--color-fg-secondary)' }}>
                    Click the button to trigger an error
                  </p>
                  <Button size="sm" variant="destructive" onClick={() => setShowBuggy(true)}>
                    Crash Component
                  </Button>
                </Stack>
              )}
            </ErrorBoundary>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// ─── Mobile Patterns Section ─────────────────────────────────────────────────

function MobilePatternsSection() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState('home');

  return (
    <div>
      <h2 className={styles.sectionTitle}>Mobile Patterns</h2>
      <p className={styles.sectionDesc}>
        Touch-optimized components: bottom sheets, drawer navigation, and mobile nav bars.
      </p>
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Bottom Sheet</h3>
        <p className={styles.sectionSubtitle}>
          Mobile-friendly overlay that slides up from the bottom
        </p>

        <Button onClick={() => setBottomSheetOpen(true)}>Open Bottom Sheet</Button>

        <BottomSheet
          open={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
          title="Select an option"
          description="Choose one of the following actions"
        >
          <Stack gap={2}>
            {['View details', 'Edit item', 'Share', 'Duplicate', 'Archive', 'Delete'].map(
              (action) => (
                <Button
                  key={action}
                  variant={action === 'Delete' ? 'destructive' : 'ghost'}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => setBottomSheetOpen(false)}
                >
                  {action}
                </Button>
              ),
            )}
          </Stack>
        </BottomSheet>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Drawer Navigation</h3>
        <p className={styles.sectionSubtitle}>Slide-out navigation panel for mobile menus</p>

        <HStack gap={2}>
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer (Left)</Button>
        </HStack>

        <DrawerNav
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side="left"
          title="Navigation"
        >
          <Stack gap={1}>
            {['Dashboard', 'Projects', 'Team', 'Settings', 'Help & Support'].map((item) => (
              <Button
                key={item}
                variant="ghost"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setDrawerOpen(false)}
              >
                {item}
              </Button>
            ))}
          </Stack>
        </DrawerNav>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Mobile Navigation Bar</h3>
        <p className={styles.sectionSubtitle}>
          Fixed bottom navigation for mobile apps (resize to mobile to see it in context)
        </p>

        <div
          style={{
            position: 'relative',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            maxWidth: '375px',
          }}
        >
          <MobileNav
            items={[
              { key: 'home', label: 'Home', icon: <span>&#8962;</span> },
              { key: 'search', label: 'Search', icon: <span>&#128269;</span> },
              { key: 'add', label: 'Create', icon: <span>&#43;</span> },
              { key: 'notifications', label: 'Alerts', icon: <span>&#128276;</span> },
              { key: 'profile', label: 'Profile', icon: <span>&#9786;</span> },
            ]}
            activeKey={activeNavKey}
            onChange={setActiveNavKey}
            style={{ position: 'relative' }}
          />
        </div>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Container</h3>
        <p className={styles.sectionSubtitle}>
          Responsive content wrapper with max-width constraints
        </p>

        <Stack gap={3}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Container key={size} size={size}>
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--color-fg-secondary)',
                }}
              >
                Container size=&quot;{size}&quot;
              </div>
            </Container>
          ))}
        </Stack>
      </div>
    </div>
  );
}

// ─── Marketing Section ───────────────────────────────────────────────────────

function MarketingSection() {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Marketing Components</h2>
      <p className={styles.sectionDesc}>
        Content and marketing components for landing pages, product sites, and campaigns.
      </p>

      <Stack gap="xl">
        {/* Hero */}
        <div>
          <h3 className={styles.groupTitle}>Hero</h3>
          <Stack gap="lg">
            <Hero
              headline="Build faster with Nimbus"
              subheadline="The all-in-one platform for modern teams. Ship products your customers love, without the complexity."
              primaryCTA={{ label: 'Start Free Trial', href: '#' }}
              secondaryCTA={{ label: 'Watch Demo', href: '#' }}
              badge="Now in beta"
            />
            <Hero
              headline="Ship products 10x faster"
              subheadline="Nimbus gives your team superpowers. From prototype to production in record time."
              primaryCTA={{ label: 'Get Started', href: '#' }}
              media={
                <div
                  style={{
                    background: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-xl)',
                    textAlign: 'center',
                    color: 'var(--color-fg-muted)',
                  }}
                >
                  Product Screenshot Placeholder
                </div>
              }
              variant="split"
            />
          </Stack>
        </div>

        {/* Feature Section */}
        <div>
          <h3 className={styles.groupTitle}>Feature Section</h3>
          <FeatureSection
            title="Everything you need"
            subtitle="Powerful features to help your team succeed from day one."
            features={[
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'Built for speed with edge computing and smart caching.',
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                ),
                title: 'Enterprise Security',
                description: 'SOC 2 compliant with end-to-end encryption and SSO.',
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                ),
                title: 'Team Collaboration',
                description: 'Real-time editing, comments, and shared workspaces.',
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: 'Analytics Dashboard',
                description: 'Track engagement, conversions, and revenue in real time.',
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                ),
                title: 'Global CDN',
                description: 'Content delivered from 200+ edge locations worldwide.',
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: '99.99% Uptime',
                description: 'Multi-region redundancy with automatic failover.',
              },
            ]}
            columns={3}
          />
        </div>

        {/* Testimonials */}
        <div>
          <h3 className={styles.groupTitle}>Testimonials</h3>
          <HStack gap="lg" style={{ flexWrap: 'wrap' }}>
            <Testimonial
              quote="Nimbus cut our development time in half. We shipped our v2 in just 6 weeks."
              author="Sarah Chen"
              jobTitle="CTO"
              company="TechFlow"
              rating={5}
              style={{ flex: '1 1 250px' }}
            />
            <Testimonial
              quote="The best developer experience I've seen. Our whole team adopted it in days."
              author="Marcus Johnson"
              jobTitle="Engineering Lead"
              company="Datawise"
              rating={4}
              style={{ flex: '1 1 250px' }}
            />
            <Testimonial
              quote="Finally, a platform that scales with us. From 10 users to 10,000 without breaking a sweat."
              author="Elena Rodriguez"
              jobTitle="VP of Engineering"
              company="ScaleUp Inc"
              rating={5}
              style={{ flex: '1 1 250px' }}
            />
          </HStack>
        </div>

        {/* Pricing */}
        <div>
          <h3 className={styles.groupTitle}>Pricing Cards</h3>
          <HStack gap="lg" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
            <PricingCard
              name="Starter"
              price="Free"
              period=""
              description="For individuals and small projects"
              features={[
                { label: '3 projects', included: true },
                { label: '1 GB storage', included: true },
                { label: 'Community support', included: true },
                { label: 'Custom domain', included: false },
                { label: 'Analytics', included: false },
              ]}
              cta={{ label: 'Get Started', href: '#' }}
              style={{ flex: '1 1 250px' }}
            />
            <PricingCard
              name="Pro"
              price={29}
              period="/month"
              description="For growing teams and businesses"
              features={[
                { label: 'Unlimited projects', included: true },
                { label: '100 GB storage', included: true },
                { label: 'Priority support', included: true },
                { label: 'Custom domain', included: true },
                { label: 'Advanced analytics', included: true },
              ]}
              cta={{ label: 'Start Free Trial', href: '#' }}
              popular
              style={{ flex: '1 1 250px' }}
            />
            <PricingCard
              name="Enterprise"
              price={99}
              period="/month"
              description="For large organizations with custom needs"
              features={[
                { label: 'Everything in Pro', included: true },
                { label: 'Unlimited storage', included: true },
                { label: 'Dedicated support', included: true },
                { label: 'SSO & SAML', included: true },
                { label: 'SLA guarantee', included: true },
              ]}
              cta={{ label: 'Contact Sales', href: '#' }}
              style={{ flex: '1 1 250px' }}
            />
          </HStack>
        </div>

        {/* CTA Section */}
        <div>
          <h3 className={styles.groupTitle}>CTA Section</h3>
          <CTA
            headline="Ready to transform your workflow?"
            description="Join 10,000+ teams already building better products with Nimbus. Start your free trial today."
            primaryCTA={{ label: 'Start Free Trial', href: '#' }}
            secondaryCTA={{ label: 'Talk to Sales', href: '#' }}
            variant="banner"
          />
        </div>

        {/* Stats Bar */}
        <div>
          <h3 className={styles.groupTitle}>Stats Bar</h3>
          <StatsBar
            stats={[
              { value: 10000, label: 'Active Teams', suffix: '+', trend: 'up' },
              { value: '99.9', label: 'Uptime', suffix: '%' },
              { value: 50, label: 'Countries', trend: 'up' },
              { value: 4.9, label: 'User Rating', suffix: '/5' },
            ]}
          />
        </div>

        {/* Timeline */}
        <div>
          <h3 className={styles.groupTitle}>Timeline</h3>
          <Timeline
            items={[
              {
                title: 'Company Founded',
                description: 'Started with a mission to simplify developer workflows.',
                date: 'January 2024',
                status: 'complete',
              },
              {
                title: 'Public Beta Launch',
                description:
                  'Opened to 1,000 early adopters. Received overwhelmingly positive feedback.',
                date: 'June 2024',
                status: 'complete',
              },
              {
                title: 'Series A Funding',
                description: 'Raised $15M led by Acme Ventures to expand the platform.',
                date: 'January 2025',
                status: 'complete',
              },
              {
                title: 'Enterprise Launch',
                description: 'Launching SSO, SAML, and dedicated support for enterprise customers.',
                date: 'March 2026',
                status: 'active',
              },
              {
                title: 'Global Expansion',
                description: 'Opening data centers in Europe and Asia-Pacific regions.',
                date: 'Q3 2026',
                status: 'pending',
              },
            ]}
          />
        </div>

        {/* Logo Cloud */}
        <div>
          <h3 className={styles.groupTitle}>Logo Cloud</h3>
          <LogoCloud
            title="Trusted by innovative teams"
            logos={[
              { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Acme', alt: 'Acme Corp' },
              { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Globex', alt: 'Globex' },
              { src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Initech', alt: 'Initech' },
              {
                src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Hooli',
                alt: 'Hooli',
                href: '#',
              },
              {
                src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Stark',
                alt: 'Stark Industries',
              },
              {
                src: 'https://placehold.co/120x40/e2e8f0/64748b?text=Wayne',
                alt: 'Wayne Enterprises',
              },
            ]}
          />
        </div>
      </Stack>
    </div>
  );
}

// ─── Navigation Section ───────────────────────────────────────────────────────

function NavigationSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Navigation Components</h2>
      <p className={styles.sectionDesc}>
        Wayfinding elements for apps and websites — navbars, sidebars, breadcrumbs, pagination, and
        footers.
      </p>

      {/* Navbar */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Navbar</h3>
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <Navbar brand={<NavbarBrand>Nimbus</NavbarBrand>}>
            <NavbarContent>
              <span
                role="link"
                tabIndex={0}
                style={{
                  color: 'var(--color-fg-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Product
              </span>
              <span
                role="link"
                tabIndex={0}
                style={{
                  color: 'var(--color-fg-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                Pricing
              </span>
              <span
                role="link"
                tabIndex={0}
                style={{
                  color: 'var(--color-fg-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                Docs
              </span>
            </NavbarContent>
            <NavbarActions>
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
              <Button size="sm">Get Started</Button>
            </NavbarActions>
          </Navbar>
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Sidebar</h3>
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: '380px',
            display: 'flex',
          }}
        >
          <Sidebar collapsed={sidebarCollapsed}>
            <SidebarHeader>
              <HStack gap={2}>
                <span style={{ fontSize: '18px' }}>🔮</span>
                {!sidebarCollapsed && (
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Arcana</span>
                )}
              </HStack>
            </SidebarHeader>
            <SidebarContent>
              <SidebarSection label="Main">
                <SidebarItem active icon={<span>📊</span>}>
                  Dashboard
                </SidebarItem>
                <SidebarItem icon={<span>📁</span>}>Projects</SidebarItem>
                <SidebarItem icon={<span>👥</span>}>Team</SidebarItem>
                <SidebarItem icon={<span>📈</span>}>Analytics</SidebarItem>
              </SidebarSection>
              <SidebarSection label="Settings">
                <SidebarItem icon={<span>⚙️</span>}>General</SidebarItem>
                <SidebarItem icon={<span>🔒</span>}>Security</SidebarItem>
              </SidebarSection>
            </SidebarContent>
            <SidebarFooter>
              <Button
                size="sm"
                variant="ghost"
                style={{ width: '100%' }}
                onClick={() => setSidebarCollapsed((v) => !v)}
              >
                {sidebarCollapsed ? '→' : '← Collapse'}
              </Button>
            </SidebarFooter>
          </Sidebar>
          <div
            style={{
              flex: 1,
              padding: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-fg-muted)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Main content area
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Breadcrumb</h3>
        <Stack gap={4}>
          <Breadcrumb>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Projects</BreadcrumbItem>
            <BreadcrumbItem href="#">Nimbus Dashboard</BreadcrumbItem>
            <BreadcrumbItem current>Settings</BreadcrumbItem>
          </Breadcrumb>
          <Breadcrumb separator="→">
            <BreadcrumbItem href="#">Store</BreadcrumbItem>
            <BreadcrumbItem href="#">Electronics</BreadcrumbItem>
            <BreadcrumbItem current>Headphones</BreadcrumbItem>
          </Breadcrumb>
        </Stack>
      </div>

      {/* Pagination */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Pagination</h3>
        <Stack gap={4}>
          <Pagination page={currentPage} totalPages={12} onPageChange={setCurrentPage} />
          <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-fg-muted)' }}>
            Page {currentPage} of 12
          </p>
        </Stack>
      </div>

      {/* Footer */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Footer</h3>
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <Footer>
            <FooterSection title="Product">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
              <FooterLink href="#">Roadmap</FooterLink>
            </FooterSection>
            <FooterSection title="Company">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
            </FooterSection>
            <FooterSection title="Resources">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Community</FooterLink>
            </FooterSection>
            <FooterSection title="Legal">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
            </FooterSection>
            <FooterBottom>© 2026 Nimbus Inc. All rights reserved.</FooterBottom>
          </Footer>
        </div>
      </div>
    </div>
  );
}

// ─── E-commerce Section ──────────────────────────────────────────────────────

function EcommerceSection() {
  const [cartQty, setCartQty] = useState(2);
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h2 className={styles.sectionTitle}>E-commerce Components</h2>
      <p className={styles.sectionDesc}>
        Product displays, shopping carts, pricing, and ratings for online stores.
      </p>

      {/* ProductCard */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Product Cards</h3>
        <div className={styles.productGrid}>
          <ProductCard
            title="Wireless Headphones"
            image="https://placehold.co/400x400/e2e8f0/64748b?text=Headphones"
            price={{ current: 149.99, currency: 'USD' }}
            rating={{ value: 4.5, count: 128 }}
            badge="New"
            onAddToCart={() => {}}
          />
          <ProductCard
            title="Mechanical Keyboard"
            image="https://placehold.co/400x400/e2e8f0/64748b?text=Keyboard"
            price={{ current: 89.99, currency: 'USD', original: 129.99 }}
            rating={{ value: 4.8, count: 256 }}
            badge="Sale"
            onAddToCart={() => {}}
          />
          <ProductCard
            title="USB-C Hub"
            image="https://placehold.co/400x400/e2e8f0/64748b?text=USB-C+Hub"
            price={{ current: 49.99, currency: 'USD' }}
            rating={{ value: 4.2, count: 64 }}
            onAddToCart={() => {}}
          />
        </div>
      </div>

      {/* CartItem */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Cart Items</h3>
        <Card>
          <CardBody>
            <Stack gap={0}>
              <CartItem
                title="Wireless Headphones"
                price={149.99}
                quantity={cartQty}
                onQuantityChange={setCartQty}
                onRemove={() => {}}
                image="https://placehold.co/80x80/e2e8f0/64748b?text=HP"
                variant="Black"
                currency="USD"
              />
              <CartItem
                title="USB-C Hub"
                price={49.99}
                quantity={1}
                onQuantityChange={() => {}}
                onRemove={() => {}}
                image="https://placehold.co/80x80/e2e8f0/64748b?text=USB"
                currency="USD"
              />
            </Stack>
          </CardBody>
        </Card>
      </div>

      {/* QuantitySelector + PriceDisplay + RatingStars */}
      <div className={styles.twoCol}>
        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Quantity Selector</h3>
          <Stack gap={4}>
            <QuantitySelector value={cartQty} onChange={setCartQty} min={1} max={10} />
            <QuantitySelector value={1} onChange={() => {}} min={1} max={99} disabled />
          </Stack>
        </div>

        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Price Display</h3>
          <Stack gap={3}>
            <PriceDisplay value={149.99} currency="USD" />
            <PriceDisplay value={89.99} currency="USD" originalValue={129.99} />
            <PriceDisplay value={0} currency="USD" />
          </Stack>
        </div>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Rating Stars</h3>
        <Stack gap={4}>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Read-only
            </p>
            <HStack gap={4}>
              <RatingStars value={4.5} count={128} />
              <RatingStars value={3} count={42} />
              <RatingStars value={5} count={1024} />
            </HStack>
          </div>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Interactive — click to rate
            </p>
            <RatingStars value={rating} onChange={setRating} interactive />
          </div>
        </Stack>
      </div>
    </div>
  );
}

// ─── Editorial Section ───────────────────────────────────────────────────────

function EditorialSection() {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Editorial Components</h2>
      <p className={styles.sectionDesc}>
        Content-focused components for blogs, articles, and publishing platforms.
      </p>

      {/* PullQuote */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Pull Quote</h3>
        <div className={styles.twoCol}>
          <PullQuote
            quote="Design is not just what it looks like and feels like. Design is how it works."
            attribution="Steve Jobs"
          />
          <PullQuote
            quote="The best way to predict the future is to invent it."
            attribution="Alan Kay"
            variant="accent"
          />
        </div>
      </div>

      {/* AuthorCard */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Author Card</h3>
        <div className={styles.twoCol}>
          <AuthorCard
            name="Sarah Chen"
            bio="Staff engineer at Nimbus. Writing about design systems, accessibility, and the intersection of AI and design."
            avatar="https://placehold.co/80x80/e2e8f0/64748b?text=SC"
            social={[
              { platform: 'twitter', url: '#' },
              { platform: 'github', url: '#' },
            ]}
          />
          <AuthorCard
            name="Marcus Johnson"
            bio="Product designer exploring the boundaries of generative UI."
            avatar="https://placehold.co/80x80/e2e8f0/64748b?text=MJ"
            variant="inline"
          />
        </div>
      </div>

      {/* NewsletterSignup */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Newsletter Signup</h3>
        <Stack gap={4}>
          <NewsletterSignup
            title="Stay in the loop"
            description="Get weekly updates on design systems, component architecture, and AI tooling."
            variant="card"
          />
          <NewsletterSignup title="Subscribe to our newsletter" variant="inline" />
        </Stack>
      </div>

      {/* RelatedPosts */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Related Posts</h3>
        <RelatedPosts
          posts={[
            {
              title: 'Building a Token-Driven Design System',
              excerpt:
                'How we structured our three-tier token architecture for maximum flexibility.',
              href: '#',
              image: 'https://placehold.co/400x200/e2e8f0/64748b?text=Tokens',
              date: 'Mar 12, 2026',
            },
            {
              title: 'Responsive Design in 2026',
              excerpt: 'Mobile-first is table stakes. Here is what comes next.',
              href: '#',
              image: 'https://placehold.co/400x200/e2e8f0/64748b?text=Responsive',
              date: 'Mar 8, 2026',
            },
            {
              title: 'AI-First Component APIs',
              excerpt: 'Designing component interfaces that machines can reason about effectively.',
              href: '#',
              image: 'https://placehold.co/400x200/e2e8f0/64748b?text=AI+APIs',
              date: 'Mar 1, 2026',
            },
          ]}
        />
      </div>

      {/* ArticleLayout */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Article Layout</h3>
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <ArticleLayout
            sidebar={
              <Stack gap={4}>
                <AuthorCard
                  name="Sarah Chen"
                  bio="Staff engineer at Nimbus"
                  avatar="https://placehold.co/40x40/e2e8f0/64748b?text=SC"
                  variant="inline"
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-fg-muted)',
                  }}
                >
                  March 15, 2026 · 8 min read
                </p>
              </Stack>
            }
          >
            <h1
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: '0 0 var(--spacing-sm)',
              }}
            >
              The Future of Design Systems
            </h1>
            <p
              style={{
                color: 'var(--color-fg-secondary)',
                fontSize: 'var(--font-size-lg)',
                margin: '0 0 var(--spacing-lg)',
              }}
            >
              Why token-driven architecture will replace utility-class frameworks
            </p>
            <p>
              The evolution of design systems has been remarkable. From hand-coded CSS to utility
              frameworks to token-driven architectures, each generation has brought us closer to the
              ideal: beautiful interfaces that are predictable, maintainable, and scalable.
            </p>
            <p>
              Token-driven systems represent a fundamental shift. Instead of prescribing how
              components look, they describe the design decisions that determine appearance. A
              single JSON file controls typography, color, spacing, elevation, and motion — enabling
              themes that feel cohesive without constraining creativity.
            </p>
          </ArticleLayout>
        </div>
      </div>
    </div>
  );
}

// ─── Utilities & Media Section ──────────────────────────────────────────────

function UtilitiesSection() {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Utility & Media Components</h2>
      <p className={styles.sectionDesc}>
        Interactive utilities, clipboard tools, keyboard shortcuts, scroll areas, and media display.
      </p>

      {/* ScrollArea */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Scroll Area</h3>
        <div className={styles.twoCol}>
          <ScrollArea style={{ height: '200px' }}>
            <Stack gap={2} style={{ padding: 'var(--spacing-sm)' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-fg-secondary)',
                  }}
                >
                  Item {i + 1} — Scrollable list content
                </div>
              ))}
            </Stack>
          </ScrollArea>
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                margin: '0 0 var(--spacing-sm)',
              }}
            >
              Themed scrollbar with auto-hide. Scroll the list to see it in action.
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Collapsible</h3>
        <Card>
          <CardBody>
            <Collapsible
              open={collapsibleOpen}
              onOpenChange={setCollapsibleOpen}
              trigger={
                <Button variant="ghost" size="sm">
                  {collapsibleOpen ? 'Hide' : 'Show'} Advanced Settings
                </Button>
              }
            >
              <Stack gap={3} style={{ paddingTop: 'var(--spacing-md)' }}>
                <Input label="API Key" placeholder="sk-..." />
                <Input label="Webhook URL" placeholder="https://..." />
                <Toggle label="Enable debug mode" checked={debugMode} onChange={setDebugMode} />
              </Stack>
            </Collapsible>
          </CardBody>
        </Card>
      </div>

      {/* CopyButton + KeyboardShortcut */}
      <div className={styles.twoCol}>
        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Copy Button</h3>
          <Stack gap={3}>
            <HStack gap={2}>
              <code
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family-mono)',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                npm install @arcana-ui/core
              </code>
              <CopyButton value="npm install @arcana-ui/core" />
            </HStack>
            <HStack gap={2}>
              <code
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'var(--font-family-mono)',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                pnpm add @arcana-ui/tokens
              </code>
              <CopyButton value="pnpm add @arcana-ui/tokens" variant="ghost" />
            </HStack>
          </Stack>
        </div>

        <div className={styles.dashSection}>
          <h3 className={styles.groupTitle}>Keyboard Shortcuts</h3>
          <Stack gap={3}>
            <HStack gap={3}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-fg-secondary)' }}>
                Save
              </span>
              <KeyboardShortcut keys={['mod', 'S']} />
            </HStack>
            <HStack gap={3}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-fg-secondary)' }}>
                Command Palette
              </span>
              <KeyboardShortcut keys={['mod', 'K']} />
            </HStack>
            <HStack gap={3}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-fg-secondary)' }}>
                Search
              </span>
              <KeyboardShortcut keys={['mod', 'shift', 'F']} />
            </HStack>
            <HStack gap={3}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-fg-secondary)' }}>
                Delete
              </span>
              <KeyboardShortcut keys={['Backspace']} />
            </HStack>
          </Stack>
        </div>
      </div>

      {/* Image */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Image</h3>
        <div className={styles.twoCol}>
          <Image
            src="https://placehold.co/600x400/e2e8f0/64748b?text=Lazy+Loaded"
            alt="Example of lazy-loaded image with skeleton fallback"
            radius="lg"
          />
          <Image
            src="https://placehold.co/invalid-url"
            alt="Broken image showing error fallback"
            radius="lg"
            fallback={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  background: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-fg-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Image failed to load — fallback displayed
              </div>
            }
          />
        </div>
      </div>

      {/* Carousel */}
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Carousel</h3>
        <Carousel>
          {['Product Tour', 'Feature Highlight', 'Customer Story', 'Team Update'].map((label) => (
            <div
              key={label}
              style={{
                minWidth: '280px',
                height: '180px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-fg-secondary)',
                flexShrink: 0,
              }}
            >
              {label}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

// ─── Main Kitchen Sink ────────────────────────────────────────────────────────

// ─── Overlays Section ────────────────────────────────────────────────────────

const COMMAND_ITEMS: CommandItem[] = [
  { id: 'dash', label: 'Go to Dashboard', group: 'Navigation', shortcut: '⌘D' },
  { id: 'settings', label: 'Go to Settings', group: 'Navigation', shortcut: '⌘,' },
  { id: 'profile', label: 'View Profile', group: 'Navigation' },
  { id: 'new-project', label: 'Create Project', group: 'Actions', shortcut: '⌘N' },
  { id: 'invite', label: 'Invite Team Member', group: 'Actions' },
  { id: 'export', label: 'Export Data', group: 'Actions', shortcut: '⌘E' },
  { id: 'theme', label: 'Toggle Dark Mode', group: 'Preferences' },
  { id: 'help', label: 'Help & Documentation', group: 'Preferences', shortcut: '⌘?' },
];

function OverlaysSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<'left' | 'right' | 'bottom'>('right');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [publicWorkspace, setPublicWorkspace] = useState(false);

  useHotkey('k', () => setCmdOpen(true), { modifier: 'meta' });

  return (
    <div>
      <h2 className={styles.sectionTitle}>Overlay Components</h2>
      <p className={styles.sectionDesc}>
        Drawers, popovers, and command palettes — floating UI that appears on top of content.
      </p>
      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Drawer</h3>
        <p className={styles.sectionSubtitle}>Slide-out panels for detail views and forms</p>
        <HStack gap={2}>
          <Button
            size="sm"
            onClick={() => {
              setDrawerSide('right');
              setDrawerOpen(true);
            }}
          >
            Right Drawer
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setDrawerSide('left');
              setDrawerOpen(true);
            }}
          >
            Left Drawer
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDrawerSide('bottom');
              setDrawerOpen(true);
            }}
          >
            Bottom Drawer
          </Button>
        </HStack>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side={drawerSide}
          title="Edit Settings"
          description="Configure your workspace preferences"
          footer={
            <HStack gap={2} justify="flex-end">
              <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setDrawerOpen(false)}>
                Save Changes
              </Button>
            </HStack>
          }
        >
          <Stack gap={4}>
            <Input label="Workspace Name" placeholder="My Workspace" />
            <Textarea label="Description" placeholder="Describe your workspace..." rows={3} />
            <Toggle
              label="Public workspace"
              checked={publicWorkspace}
              onChange={setPublicWorkspace}
            />
          </Stack>
        </Drawer>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Popover</h3>
        <p className={styles.sectionSubtitle}>Floating content panels with auto-positioning</p>
        <HStack gap={4}>
          <Popover
            trigger={<Button size="sm">Click Popover</Button>}
            content={
              <div>
                <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)' }}>Sarah Chen</p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-fg-secondary)',
                  }}
                >
                  sarah@lumina.io · Admin
                </p>
              </div>
            }
          />
          <Popover
            trigger={
              <Button size="sm" variant="secondary">
                With Arrow
              </Button>
            }
            content={<p style={{ margin: 0 }}>This popover has an arrow indicator.</p>}
            showArrow
            side="top"
          />
        </HStack>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.groupTitle}>Command Palette</h3>
        <p className={styles.sectionSubtitle}>
          Press{' '}
          <kbd
            style={{
              padding: '2px 6px',
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-default)',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-xs)',
            }}
          >
            ⌘K
          </kbd>{' '}
          or click the button below
        </p>
        <Button size="sm" onClick={() => setCmdOpen(true)}>
          Open Command Palette
        </Button>
        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          items={COMMAND_ITEMS}
          onSelect={(item) => setCmdOpen(false)}
        />
      </div>
    </div>
  );
}

type SectionId =
  | 'overview'
  | 'navigation'
  | 'components'
  | 'forms'
  | 'data'
  | 'layout'
  | 'overlays'
  | 'feedback'
  | 'mobile'
  | 'marketing'
  | 'ecommerce'
  | 'editorial'
  | 'utilities';

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'components', label: 'Components' },
  { id: 'forms', label: 'Forms' },
  { id: 'data', label: 'Data' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'layout', label: 'Layout' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'utilities', label: 'Utilities' },
];

function KitchenSink() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');

  return (
    <div>
      {/* Section navigation */}
      <nav className={styles.contentNav}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`${styles.navLink} ${activeSection === s.id ? styles.navActive : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Page content */}
      <div className={styles.pageContent}>
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'navigation' && <NavigationSection />}
        {activeSection === 'components' && <ComponentsSection />}
        {activeSection === 'forms' && <FormsSection />}
        {activeSection === 'data' && <DataSection />}
        {activeSection === 'overlays' && <OverlaysSection />}
        {activeSection === 'feedback' && <FeedbackSection />}
        {activeSection === 'layout' && <LayoutSection />}
        {activeSection === 'mobile' && <MobilePatternsSection />}
        {activeSection === 'marketing' && <MarketingSection />}
        {activeSection === 'ecommerce' && <EcommerceSection />}
        {activeSection === 'editorial' && <EditorialSection />}
        {activeSection === 'utilities' && <UtilitiesSection />}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<PresetId>('light');

  const handlePresetChange = (id: PresetId) => {
    setActivePresetId(id);
  };

  return (
    <ToastProvider>
      <div className={styles.app}>
        {/* Dev banner */}
        <div className={styles.devBanner}>
          <span className={styles.devBannerIcon}>🚧</span>
          <span>
            Arcana UI Playground — token-driven design system with <strong>60+ components</strong>{' '}
            across 6 themes.
          </span>
        </div>

        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandLogo}>🔮</span>
            <span className={styles.brandName}>Arcana UI</span>
            <span className={styles.brandVersion}>v0.1.0</span>
            <span className={styles.componentCount}>60+ components</span>
          </div>

          <div className={styles.topbarSpacer} />

          <div className={styles.topbarControls}>
            <button
              className={`${styles.panelToggle} ${leftOpen ? styles.panelToggleActive : ''}`}
              onClick={() => setLeftOpen((v) => !v)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 4h12v1.5H2V4zm0 3.5h12V9H2V7.5zm0 3.5h8v1.5H2V11z" />
              </svg>
              Token Editor
            </button>

            <div className={styles.topbarDivider} />

            <button
              className={`${styles.panelToggle} ${rightOpen ? styles.panelToggleActive : ''}`}
              onClick={() => setRightOpen((v) => !v)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z" />
              </svg>
              A11y Panel
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className={styles.workspace}>
          {/* Left: Token Editor */}
          <aside className={`${styles.leftPanel} ${!leftOpen ? styles.collapsed : ''}`}>
            <TokenEditor activePresetId={activePresetId} onPresetChange={handlePresetChange} />
          </aside>

          {/* Center: Kitchen Sink */}
          <main id="preview-area" className={styles.main}>
            <KitchenSink />
          </main>

          {/* Right: Accessibility Panel */}
          <aside className={`${styles.rightPanel} ${!rightOpen ? styles.collapsed : ''}`}>
            <AccessibilityPanel />
          </aside>
        </div>
      </div>
    </ToastProvider>
  );
}

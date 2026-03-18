import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  BottomSheet,
  Button,
  CTA,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  CommandPalette,
  Container,
  DataTable,
  DatePicker,
  Drawer,
  DrawerNav,
  EmptyState,
  FeatureSection,
  FileUpload,
  Form,
  FormErrorMessage,
  FormField,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Hero,
  Input,
  KPICard,
  LogoCloud,
  MobileNav,
  Modal,
  Popover,
  PricingCard,
  ProgressBar,
  Radio,
  RadioGroup,
  Select,
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
import React, { useState } from 'react';
import styles from './App.module.css';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { TokenEditor } from './components/TokenEditor';
import { PRESETS, type PresetId, applyPreset } from './utils/presets';

// ─── Overview Stat Card (legacy playground card) ──────────────────────────────

function OverviewStatCard({
  label,
  value,
  delta,
  positive = true,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {delta && (
        <span
          className={`${styles.statDelta} ${positive ? styles.statDeltaPos : styles.statDeltaNeg}`}
        >
          {positive ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
  );
}

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
  const activityItems = [
    {
      text: 'Alice Zhao deployed v2.4.1 to production',
      time: '2m ago',
      color: 'var(--color-status-success)',
    },
    {
      text: 'Bob Smith opened PR #142 — "Refactor auth flow"',
      time: '18m ago',
      color: 'var(--color-action-primary)',
    },
    {
      text: 'CI pipeline failed on branch feature/dark-mode',
      time: '41m ago',
      color: 'var(--color-status-error)',
    },
    {
      text: 'Carlos Rivera commented on issue #89',
      time: '1h ago',
      color: 'var(--color-status-info)',
    },
    {
      text: 'Diana Prince created milestone "Q2 Release"',
      time: '2h ago',
      color: 'var(--color-status-warning)',
    },
  ];

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <OverviewStatCard label="Total Projects" value="24" delta="3 this month" positive />
        <OverviewStatCard label="Active Users" value="1,284" delta="12% vs last week" positive />
        <OverviewStatCard label="Open Issues" value="47" delta="8 new today" positive={false} />
        <OverviewStatCard label="Deployments" value="312" delta="28 this week" positive />
      </div>

      {/* Activity Feed */}
      <div className={styles.activityFeed}>
        <div className={styles.activityHeader}>Recent Activity</div>
        {activityItems.map((item, i) => (
          <div key={i} className={styles.activityItem}>
            <div className={styles.activityDot} style={{ background: item.color }} />
            <span className={styles.activityText}>{item.text}</span>
            <span className={styles.activityTime}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Components Section ───────────────────────────────────────────────────────

function ComponentsSection() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('react');
  const [toggleOn, setToggleOn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState('overview');

  return (
    <div>
      {/* Buttons */}
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Buttons</h3>
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
          <h3 className={styles.sectionTitle}>Badges</h3>
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
          <h3 className={styles.sectionTitle}>Avatars</h3>
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
        <h3 className={styles.sectionTitle}>Alerts</h3>
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
        <h3 className={styles.sectionTitle}>Modal</h3>
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
        <h3 className={styles.sectionTitle}>Toast Notifications</h3>
        <p className={styles.sectionSubtitle}>Ephemeral messages for feedback</p>
        <ToastDemo />
      </div>

      {/* Tabs */}
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Tabs</h3>
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
        <h3 className={styles.sectionTitle}>Form Controls</h3>
        <p className={styles.sectionSubtitle}>Checkboxes, radios, and toggles</p>
        <div className={styles.threeCol}>
          <Stack gap={3}>
            <Checkbox
              label="Enable dark mode"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <Checkbox label="Email notifications" checked={true} onChange={() => {}} />
            <Checkbox label="Weekly digest" checked={false} onChange={() => {}} />
            <Checkbox label="Disabled option" disabled checked={false} onChange={() => {}} />
            <Checkbox
              label="Two-factor auth"
              description="Add extra security to your account."
              checked={true}
              onChange={() => {}}
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
            <Toggle label="Email alerts" checked={true} onChange={() => {}} />
            <Toggle label="Beta features" checked={false} onChange={() => {}} />
            <Toggle size="sm" label="Preview mode" checked={false} onChange={() => {}} />
          </Stack>
        </div>
      </div>

      {/* Accordion */}
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Accordion</h3>
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
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Team Members</h3>
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
        <h3 className={styles.sectionTitle}>Empty States</h3>
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
        <h3 className={styles.sectionTitle}>Stat Cards</h3>
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
        <h3 className={styles.sectionTitle}>Progress Bars</h3>
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
        <h3 className={styles.sectionTitle}>KPI Cards</h3>
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
      <h3 className={styles.sectionTitle}>DataTable</h3>
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
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Layout Primitives</h3>
        <p className={styles.sectionSubtitle}>
          Stack, HStack, Grid — composable layout building blocks
        </p>

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

// ─── Mobile Patterns Section ─────────────────────────────────────────────────

function MobilePatternsSection() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState('home');

  return (
    <div>
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Bottom Sheet</h3>
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
        <h3 className={styles.sectionTitle}>Drawer Navigation</h3>
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
        <h3 className={styles.sectionTitle}>Mobile Navigation Bar</h3>
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
        <h3 className={styles.sectionTitle}>Container</h3>
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

  useHotkey('k', () => setCmdOpen(true), { modifier: 'meta' });

  return (
    <div>
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Drawer</h3>
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
            <Toggle label="Public workspace" checked={false} onChange={() => {}} />
          </Stack>
        </Drawer>
      </div>

      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Popover</h3>
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
        <h3 className={styles.sectionTitle}>Command Palette</h3>
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
  | 'components'
  | 'forms'
  | 'data'
  | 'layout'
  | 'overlays'
  | 'mobile'
  | 'marketing';

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'components', label: 'Components' },
  { id: 'forms', label: 'Forms & Inputs' },
  { id: 'data', label: 'Data & Tables' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'layout', label: 'Layout' },
  { id: 'mobile', label: 'Mobile Patterns' },
  { id: 'marketing', label: 'Marketing' },
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
        {activeSection === 'components' && <ComponentsSection />}
        {activeSection === 'forms' && <FormsSection />}
        {activeSection === 'data' && <DataSection />}
        {activeSection === 'overlays' && <OverlaysSection />}
        {activeSection === 'layout' && <LayoutSection />}
        {activeSection === 'mobile' && <MobilePatternsSection />}
        {activeSection === 'marketing' && <MarketingSection />}
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
            Arcana UI is actively under development — expect broken features.{' '}
            <strong>Official launch coming soon.</strong>
          </span>
        </div>

        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandLogo}>🔮</span>
            <span className={styles.brandName}>Arcana UI</span>
            <span className={styles.brandVersion}>v0.1.0</span>
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

import React, { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Toggle,
  Badge,
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ToastProvider,
  useToast,
  Stack,
  HStack,
  Grid,
  Container,
  EmptyState,
  Form,
  FormField,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@arcana-ui/core'
import { TokenEditor } from './components/TokenEditor'
import { AccessibilityPanel } from './components/AccessibilityPanel'
import { PRESETS, PresetId, applyPreset } from './utils/presets'
import styles from './App.module.css'

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  delta,
  positive = true,
}: {
  label: string
  value: string
  delta?: string
  positive?: boolean
}) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {delta && (
        <span className={`${styles.statDelta} ${positive ? styles.statDeltaPos : styles.statDeltaNeg}`}>
          {positive ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
  )
}

// ─── Toast Demo ───────────────────────────────────────────────────────────────

function ToastDemo() {
  const { toast } = useToast()
  return (
    <div className={styles.demoFlex}>
      <Button size="sm" onClick={() => toast({ title: 'Changes saved', description: 'Your profile was updated.' })}>
        Default
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => toast({ title: 'Deployed!', description: 'v2.4.1 is now live.', variant: 'success' })}
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({ title: 'Usage limit approaching', description: '80% of your monthly quota used.', variant: 'warning' })
        }
      >
        Warning
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() =>
          toast({ title: 'Build failed', description: 'Check the logs for details.', variant: 'error' })
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
  )
}

// ─── Overview Dashboard ───────────────────────────────────────────────────────

function OverviewSection() {
  const activityItems = [
    { text: 'Alice Zhao deployed v2.4.1 to production', time: '2m ago', color: 'var(--arcana-feedback-success)' },
    { text: 'Bob Smith opened PR #142 — "Refactor auth flow"', time: '18m ago', color: 'var(--arcana-action-primary)' },
    { text: 'CI pipeline failed on branch feature/dark-mode', time: '41m ago', color: 'var(--arcana-feedback-error)' },
    { text: 'Carlos Rivera commented on issue #89', time: '1h ago', color: 'var(--arcana-feedback-info)' },
    { text: 'Diana Prince created milestone "Q2 Release"', time: '2h ago', color: 'var(--arcana-feedback-warning)' },
  ]

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Projects" value="24" delta="3 this month" positive />
        <StatCard label="Active Users" value="1,284" delta="12% vs last week" positive />
        <StatCard label="Open Issues" value="47" delta="8 new today" positive={false} />
        <StatCard label="Deployments" value="312" delta="28 this week" positive />
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
  )
}

// ─── Components Section ───────────────────────────────────────────────────────

function ComponentsSection() {
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('react')
  const [toggleOn, setToggleOn] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [tabValue, setTabValue] = useState('overview')

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
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div className={styles.demoRow}>
          <div className={styles.demoRowLabel}>Sizes</div>
          <div className={styles.demoFlex}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading size="md">Loading</Button>
            <Button disabled size="md">Disabled</Button>
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
            <Badge dot variant="success">Online</Badge>
            <Badge dot variant="warning">Away</Badge>
            <Badge dot variant="error">Offline</Badge>
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
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Delete</Button>
            </HStack>
          }
        >
          <p style={{ margin: 0, color: 'var(--arcana-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Deleting <strong>Project Alpha</strong> will remove:
          </p>
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px', color: 'var(--arcana-text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
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
              <Tab value="billing" disabled>Billing</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="overview">
                <div style={{ padding: '16px 0', color: 'var(--arcana-text-secondary)', fontSize: '14px' }}>
                  Overview: showing project health, recent commits, and team activity.
                </div>
              </TabPanel>
              <TabPanel value="analytics">
                <div style={{ padding: '16px 0', color: 'var(--arcana-text-secondary)', fontSize: '14px' }}>
                  Analytics: page views, conversion funnel, error rates by endpoint.
                </div>
              </TabPanel>
              <TabPanel value="settings">
                <div style={{ padding: '16px 0', color: 'var(--arcana-text-secondary)', fontSize: '14px' }}>
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
            <Checkbox label="Enable dark mode" checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} />
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
                An AI-first design system with a token-driven architecture. Built for machines to read and humans to love.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How does theme switching work?</AccordionTrigger>
              <AccordionContent>
                Set <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--arcana-surface-secondary)', padding: '1px 4px', borderRadius: '3px' }}>data-theme</code> on{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--arcana-surface-secondary)', padding: '1px 4px', borderRadius: '3px' }}>document.documentElement</code>,
                or override CSS custom properties via JS for custom themes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. WAI-ARIA patterns, keyboard navigation, and focus management built-in. Check the A11y panel on the right for live analysis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" defaultValue={['f1']}>
            <AccordionItem value="f1">
              <AccordionTrigger>Can I export my theme?</AccordionTrigger>
              <AccordionContent>
                Yes — use the "Export JSON" button in the Token Editor to copy the current theme as a flat CSS variable map.
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
  )
}

// ─── Forms Section ────────────────────────────────────────────────────────────

function FormsSection() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [agreed, setAgreed] = useState(false)

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
                  <Input placeholder="Jane Smith" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <FormHelperText>Used on your public profile.</FormHelperText>
                </FormField>
                <FormField isRequired isInvalid>
                  <FormLabel>Work email</FormLabel>
                  <Input type="email" placeholder="jane@acme.com" />
                  <FormErrorMessage>Please enter a valid work email address.</FormErrorMessage>
                </FormField>
                <FormField>
                  <FormLabel>Team size</FormLabel>
                  <Select
                    placeholder="How many engineers?"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    options={[
                      { value: '1', label: 'Just me' },
                      { value: '2-5', label: '2–5' },
                      { value: '6-20', label: '6–20' },
                      { value: '21+', label: '21+' },
                    ]}
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
                  <Button type="button" variant="secondary">Cancel</Button>
                  <Button type="submit" disabled={!agreed}>Create Account</Button>
                </HStack>
              </Stack>
            </Form>
          </CardBody>
        </Card>

        {/* Input showcase */}
        <Stack gap={4}>
          <Card>
            <CardHeader title="Input Variants" />
            <CardBody>
              <Stack gap={4}>
                <Input label="Default" placeholder="Enter text..." />
                <Input
                  label="With search icon"
                  placeholder="Search projects..."
                  type="search"
                  prefix={
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--arcana-text-muted)">
                      <path d="M6.5 1a5.5 5.5 0 104.223 9.02l3.129 3.128a.75.75 0 001.06-1.06l-3.129-3.13A5.5 5.5 0 006.5 1zM2.5 6.5a4 4 0 118 0 4 4 0 01-8 0z" />
                    </svg>
                  }
                />
                <Input label="With error" placeholder="you@email.com" type="email" error="Invalid email format." />
                <Input label="Disabled" value="Read-only value" disabled />
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Cards" description="Surface containers" />
            <CardBody>
              <div className={styles.threeCol} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <Card>
                  <CardBody>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--arcana-text-secondary)' }}>Default</p>
                  </CardBody>
                </Card>
                <Card variant="outlined">
                  <CardBody>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--arcana-text-secondary)' }}>Outlined</p>
                  </CardBody>
                </Card>
                <Card variant="elevated" interactive>
                  <CardBody>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--arcana-text-secondary)' }}>Elevated</p>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Stack>
      </div>
    </div>
  )
}

// ─── Data Section ─────────────────────────────────────────────────────────────

const TEAM_DATA = [
  { name: 'Alice Zhao', role: 'Senior Engineer', status: 'Active', projects: 4, joined: 'Jan 2024', avatar: 'Alice Zhao' },
  { name: 'Bob Smith', role: 'Product Designer', status: 'Active', projects: 7, joined: 'Mar 2024', avatar: 'Bob Smith' },
  { name: 'Carlos Rivera', role: 'Engineering Manager', status: 'Away', projects: 12, joined: 'Feb 2024', avatar: 'Carlos Rivera' },
  { name: 'Diana Prince', role: 'Frontend Engineer', status: 'Inactive', projects: 2, joined: 'Dec 2023', avatar: 'Diana Prince' },
  { name: 'Evan Walsh', role: 'DevOps Engineer', status: 'Active', projects: 6, joined: 'Apr 2024', avatar: 'Evan Walsh' },
  { name: 'Fiona Xu', role: 'QA Engineer', status: 'Active', projects: 3, joined: 'May 2024', avatar: 'Fiona Xu' },
]

function DataSection() {
  const [sortKey, setSortKey] = useState<string | null>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...TEAM_DATA].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey as keyof typeof a]
    const bv = b[sortKey as keyof typeof b]
    const cmp = String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div>
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Team Members</h3>
        <p className={styles.sectionSubtitle}>Manage access and roles across your organization</p>
        <Table striped hoverable>
          <TableHeader>
            <TableRow>
              <TableHead sortable sortDirection={sortKey === 'name' ? sortDir : undefined} onSort={() => handleSort('name')}>
                Member
              </TableHead>
              <TableHead sortable sortDirection={sortKey === 'role' ? sortDir : undefined} onSort={() => handleSort('role')}>
                Role
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead sortable sortDirection={sortKey === 'projects' ? sortDir : undefined} onSort={() => handleSort('projects')}>
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
                <TableCell style={{ color: 'var(--arcana-text-secondary)' }}>{member.role}</TableCell>
                <TableCell>
                  <Badge
                    dot
                    variant={
                      member.status === 'Active' ? 'success' : member.status === 'Away' ? 'warning' : 'secondary'
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell style={{ color: 'var(--arcana-text-secondary)', textAlign: 'center' }}>
                  {member.projects}
                </TableCell>
                <TableCell style={{ color: 'var(--arcana-text-muted)' }}>{member.joined}</TableCell>
                <TableCell>
                  <HStack gap={1}>
                    <Button size="sm" variant="ghost">Edit</Button>
                    <Button size="sm" variant="ghost">
                      <span style={{ color: 'var(--arcana-feedback-error)' }}>Remove</span>
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
                    <rect x="6" y="10" width="28" height="22" rx="3" stroke="var(--arcana-text-muted)" strokeWidth="2" />
                    <path d="M13 18h14M13 24h8" stroke="var(--arcana-text-muted)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="29" cy="11" r="5" fill="var(--arcana-feedback-error)" />
                    <path d="M29 8.5v3M29 13v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
                title="No issues found"
                description="Your project is issue-free. Keep up the good work!"
                action={<Button variant="secondary" size="sm">Create an issue</Button>}
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
    </div>
  )
}

// ─── Layout Section ───────────────────────────────────────────────────────────

function LayoutSection() {
  return (
    <div>
      <div className={styles.dashSection}>
        <h3 className={styles.sectionTitle}>Layout Primitives</h3>
        <p className={styles.sectionSubtitle}>Stack, HStack, Grid — composable layout building blocks</p>

        <div className={styles.twoCol} style={{ marginBottom: 24 }}>
          <div>
            <div className={styles.demoRowLabel}>Stack (vertical, gap-2)</div>
            <Stack gap={2}>
              {['API Server', 'Database', 'Cache Layer', 'CDN'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--arcana-surface-elevated)',
                    border: '1px solid var(--arcana-border-default)',
                    borderRadius: 'var(--arcana-component-radius)',
                    fontSize: '13px',
                    color: 'var(--arcana-text-secondary)',
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
                    background: 'var(--arcana-action-primary)',
                    color: 'var(--arcana-text-on-action)',
                    borderRadius: 'var(--arcana-component-radius)',
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
                background: 'var(--arcana-surface-elevated)',
                border: '1px solid var(--arcana-border-default)',
                borderRadius: 'var(--arcana-component-radius)',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--arcana-text-secondary)',
              }}
            >
              Cell {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  )
}

// ─── Main Kitchen Sink ────────────────────────────────────────────────────────

type SectionId = 'overview' | 'components' | 'forms' | 'data' | 'layout'

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'components', label: 'Components' },
  { id: 'forms', label: 'Forms & Inputs' },
  { id: 'data', label: 'Data & Tables' },
  { id: 'layout', label: 'Layout' },
]

function KitchenSink() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')

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
        {activeSection === 'layout' && <LayoutSection />}
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(false)
  const [activePresetId, setActivePresetId] = useState<PresetId>('light')

  const handlePresetChange = (id: PresetId) => {
    setActivePresetId(id)
  }

  return (
    <ToastProvider>
      <div className={styles.app}>
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
            <TokenEditor
              activePresetId={activePresetId}
              onPresetChange={handlePresetChange}
            />
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
  )
}

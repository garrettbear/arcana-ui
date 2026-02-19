import React, { useState } from 'react'
import {
  // Primitives
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
  // Composites
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
  // Toasts
  ToastProvider,
  useToast,
  // Layout
  Stack,
  HStack,
  Grid,
  Container,
  // Patterns
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
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

// ─── Theme Toggle ────────────────────────────────────────────────────────────

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: 'var(--arcana-surface-secondary)',
        border: '1px solid var(--arcana-border-default)',
        borderRadius: 'var(--arcana-component-radius)',
        color: 'var(--arcana-text-primary)',
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        fontFamily: 'var(--arcana-typography-font-family-sans)',
        fontSize: 'var(--arcana-typography-font-size-sm)',
        fontWeight: 'var(--arcana-typography-font-weight-medium)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 150ms ease',
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'} mode
    </button>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        marginBottom: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--arcana-border-default)',
      }}
    >
      <h2
        style={{
          margin: '0 0 1.5rem',
          fontSize: 'var(--arcana-typography-font-size-xl)',
          fontWeight: 'var(--arcana-typography-font-weight-semibold)',
          color: 'var(--arcana-text-primary)',
          fontFamily: 'var(--arcana-typography-font-family-sans)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <p
          style={{
            margin: '0 0 0.75rem',
            fontSize: 'var(--arcana-typography-font-size-sm)',
            color: 'var(--arcana-text-muted)',
            fontFamily: 'var(--arcana-typography-font-family-mono)',
          }}
        >
          {label}
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Toast Demo ──────────────────────────────────────────────────────────────

function ToastDemo() {
  const { toast } = useToast()

  return (
    <Row label="Toasts">
      <Button onClick={() => toast({ title: 'Default toast', description: 'Something happened.' })}>
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ title: 'Success!', description: 'Your changes were saved.', variant: 'success' })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Warning',
            description: 'Please review before continuing.',
            variant: 'warning',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            variant: 'error',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast({
            title: 'With action',
            description: 'You can undo this action.',
            action: { label: 'Undo', onClick: () => console.log('Undo!') },
          })
        }
      >
        With action
      </Button>
    </Row>
  )
}

// ─── Main Kitchen Sink App ───────────────────────────────────────────────────

function KitchenSink() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [radioValue, setRadioValue] = useState('opt1')
  const [toggleOn, setToggleOn] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [tabValue, setTabValue] = useState('tab1')

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--arcana-surface-primary)',
        color: 'var(--arcana-text-primary)',
        fontFamily: 'var(--arcana-typography-font-family-sans)',
      }}
    >
      {/* ─── Navbar ─── */}
      <Navbar sticky border>
        <NavbarBrand>
          <span style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--arcana-action-primary)' }}>
            🔮 Arcana UI
          </span>
        </NavbarBrand>
        <NavbarContent>
          <a href="#buttons" style={{ color: 'var(--arcana-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Components</a>
          <a href="#tokens" style={{ color: 'var(--arcana-text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Tokens</a>
        </NavbarContent>
        <NavbarActions>
          <Badge variant="info">v0.1.0</Badge>
        </NavbarActions>
      </Navbar>

      <Container size="xl" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* ─── Hero ─── */}
        <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
          <h1
            style={{
              margin: '0 0 1rem',
              fontSize: 'var(--arcana-typography-font-size-4xl)',
              fontWeight: 'var(--arcana-typography-font-weight-bold)',
              background: 'linear-gradient(135deg, var(--arcana-action-primary), var(--arcana-feedback-info))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Arcana UI Playground
          </h1>
          <p
            style={{
              margin: '0 auto 2rem',
              maxWidth: '540px',
              color: 'var(--arcana-text-secondary)',
              fontSize: 'var(--arcana-typography-font-size-lg)',
            }}
          >
            AI-first design system with token-driven theming. Every component, rendered live.
          </p>
        </div>

        {/* ─── Buttons ─── */}
        <Section title="Buttons" id="buttons">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
            <Button
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 7V5h2v2h2v2H9v2H7V9H5V7h2z" />
                </svg>
              }
            >
              With icon
            </Button>
            <Button fullWidth variant="secondary">
              Full width
            </Button>
          </Row>
        </Section>

        {/* ─── Form Inputs ─── */}
        <Section title="Form Inputs">
          <Grid columns={2} gap={6}>
            <Input
              label="Text Input"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="With Error"
              placeholder="Enter email"
              type="email"
              error="Please enter a valid email address"
            />
            <Input
              label="With Prefix"
              placeholder="Search..."
              type="search"
              prefix={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--arcana-text-muted)">
                  <path d="M6.5 1a5.5 5.5 0 104.223 9.02l3.129 3.128a.75.75 0 001.06-1.06l-3.129-3.13A5.5 5.5 0 006.5 1zM2.5 6.5a4 4 0 118 0 4 4 0 01-8 0z" />
                </svg>
              }
            />
            <Input
              label="Disabled"
              placeholder="Can't touch this"
              disabled
              value="Locked value"
            />
          </Grid>

          <div style={{ marginTop: '1.5rem' }}>
            <Textarea
              label="Textarea (auto-resize)"
              placeholder="Start typing..."
              autoResize
              showCount
              maxLength={200}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1.5rem', maxWidth: '320px' }}>
            <Select
              label="Select"
              placeholder="Choose an option"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'angular', label: 'Angular' },
              ]}
            />
          </div>
        </Section>

        {/* ─── Checkbox, Radio, Toggle ─── */}
        <Section title="Checkbox, Radio & Toggle">
          <Grid columns={3} gap={8}>
            <Stack gap={3}>
              <Checkbox
                label="Unchecked"
                checked={false}
                onChange={() => {}}
              />
              <Checkbox
                label="Checked"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Checkbox
                label="Indeterminate"
                indeterminate={indeterminate}
                checked={false}
                onChange={() => setIndeterminate((v) => !v)}
              />
              <Checkbox
                label="Disabled"
                disabled
                checked={false}
                onChange={() => {}}
              />
              <Checkbox
                label="With description"
                description="This checkbox has some extra context below it."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
            </Stack>

            <RadioGroup
              name="demo-radio"
              label="Framework"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'opt1', label: 'React', description: 'Most popular' },
                { value: 'opt2', label: 'Vue', description: 'Progressive' },
                { value: 'opt3', label: 'Svelte', description: 'Compiler-based' },
                { value: 'opt4', label: 'Disabled', disabled: true },
              ]}
            />

            <Stack gap={4}>
              <Toggle
                label="Toggle off"
                checked={false}
                onChange={() => {}}
              />
              <Toggle
                label="Toggle on"
                checked={toggleOn}
                onChange={setToggleOn}
              />
              <Toggle
                label="Disabled"
                disabled
                checked={false}
                onChange={() => {}}
              />
              <Toggle size="sm" label="Small toggle" checked={toggleOn} onChange={setToggleOn} />
              <Toggle size="lg" label="Large toggle" checked={toggleOn} onChange={setToggleOn} />
            </Stack>
          </Grid>
        </Section>

        {/* ─── Badge ─── */}
        <Section title="Badge">
          <Row label="Variants">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </Row>
          <Row label="With dot">
            <Badge dot>Default</Badge>
            <Badge dot variant="success">Online</Badge>
            <Badge dot variant="warning">Away</Badge>
            <Badge dot variant="error">Offline</Badge>
          </Row>
        </Section>

        {/* ─── Avatar ─── */}
        <Section title="Avatar">
          <Row label="Sizes">
            <Avatar size="xs" name="Alice Zhao" />
            <Avatar size="sm" name="Bob Smith" />
            <Avatar size="md" name="Carlos Rivera" />
            <Avatar size="lg" name="Diana Prince" />
            <Avatar size="xl" name="Evan Walsh" />
          </Row>
          <Row label="With image (fallback on error)">
            <Avatar src="https://i.pravatar.cc/40?img=1" alt="User 1" size="md" name="Alice" />
            <Avatar src="broken-url.jpg" alt="Fallback" size="md" name="Bob Brown" />
            <Avatar size="md" />
          </Row>
          <Row label="AvatarGroup">
            <AvatarGroup max={4}>
              <Avatar name="Alice Zhao" size="md" />
              <Avatar name="Bob Smith" size="md" />
              <Avatar name="Carlos R" size="md" />
              <Avatar name="Diana P" size="md" />
              <Avatar name="Evan W" size="md" />
              <Avatar name="Fiona X" size="md" />
            </AvatarGroup>
          </Row>
        </Section>

        {/* ─── Card ─── */}
        <Section title="Card">
          <Grid columns={3} gap={6}>
            <Card>
              <CardHeader title="Default Card" description="Standard card with padding." />
              <CardBody>
                <p style={{ margin: 0, color: 'var(--arcana-text-secondary)', fontSize: '0.875rem' }}>
                  Cards are versatile containers for grouping related content.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="secondary">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader title="Outlined Card" description="Uses a visible border." />
              <CardBody>
                <p style={{ margin: 0, color: 'var(--arcana-text-secondary)', fontSize: '0.875rem' }}>
                  Use outlined cards for secondary content areas.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated" interactive>
              <CardHeader title="Elevated + Interactive" description="Hover me." />
              <CardBody>
                <p style={{ margin: 0, color: 'var(--arcana-text-secondary)', fontSize: '0.875rem' }}>
                  Interactive cards lift on hover, great for clickable items.
                </p>
              </CardBody>
            </Card>
          </Grid>
        </Section>

        {/* ─── Alert ─── */}
        <Section title="Alert">
          <Stack gap={3}>
            <Alert variant="info" title="Informational">
              This is an informational alert. Use it to provide context or guidance.
            </Alert>
            <Alert variant="success" title="Success">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              This action cannot be undone. Please review before proceeding.
            </Alert>
            <Alert
              variant="error"
              title="Error"
              onClose={() => console.log('dismissed')}
            >
              Something went wrong. Please try again or contact support.
            </Alert>
          </Stack>
        </Section>

        {/* ─── Modal ─── */}
        <Section title="Modal / Dialog">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm Action"
            description="This will permanently delete the item. This action cannot be undone."
            footer={
              <HStack gap={2} justify="flex-end">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => setModalOpen(false)}>
                  Delete
                </Button>
              </HStack>
            }
          >
            <p style={{ margin: 0, color: 'var(--arcana-text-secondary)', fontSize: '0.875rem' }}>
              Are you sure you want to delete <strong>Project Alpha</strong>? All associated data
              will be permanently removed.
            </p>
          </Modal>
        </Section>

        {/* ─── Toast ─── */}
        <Section title="Toast / Notifications">
          <ToastDemo />
        </Section>

        {/* ─── Tabs ─── */}
        <Section title="Tabs">
          <Stack gap={6}>
            <Tabs value={tabValue} onChange={setTabValue}>
              <TabList>
                <Tab value="tab1">Overview</Tab>
                <Tab value="tab2">Settings</Tab>
                <Tab value="tab3">Members</Tab>
                <Tab value="tab4" disabled>Billing</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="tab1">
                  <p style={{ color: 'var(--arcana-text-secondary)', margin: '1rem 0 0' }}>
                    Overview content goes here. This is the default active tab.
                  </p>
                </TabPanel>
                <TabPanel value="tab2">
                  <p style={{ color: 'var(--arcana-text-secondary)', margin: '1rem 0 0' }}>
                    Settings panel content.
                  </p>
                </TabPanel>
                <TabPanel value="tab3">
                  <p style={{ color: 'var(--arcana-text-secondary)', margin: '1rem 0 0' }}>
                    Team members list.
                  </p>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Tabs defaultValue="pill1" variant="pills">
              <TabList>
                <Tab value="pill1">All</Tab>
                <Tab value="pill2">Active</Tab>
                <Tab value="pill3">Archived</Tab>
              </TabList>
            </Tabs>
          </Stack>
        </Section>

        {/* ─── Accordion ─── */}
        <Section title="Accordion">
          <Grid columns={2} gap={6}>
            <div>
              <p style={{ marginBottom: '1rem', color: 'var(--arcana-text-muted)', fontSize: '0.875rem' }}>Single expand</p>
              <Accordion type="single" defaultValue="item1">
                <AccordionItem value="item1">
                  <AccordionTrigger>What is Arcana UI?</AccordionTrigger>
                  <AccordionContent>
                    Arcana UI is an AI-first design system with token-driven theming.
                    Built for machines, beautiful for humans.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item2">
                  <AccordionTrigger>How does theme switching work?</AccordionTrigger>
                  <AccordionContent>
                    Set the <code style={{ fontFamily: 'var(--arcana-typography-font-family-mono)' }}>data-theme</code> attribute
                    on the root element to "light" or "dark". No JavaScript runtime required.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item3">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Every component follows WAI-ARIA guidelines, supports keyboard navigation,
                    and includes appropriate ARIA attributes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <p style={{ marginBottom: '1rem', color: 'var(--arcana-text-muted)', fontSize: '0.875rem' }}>Multiple expand</p>
              <Accordion type="multiple" defaultValue={['faq1', 'faq2']}>
                <AccordionItem value="faq1">
                  <AccordionTrigger>Can I customize tokens?</AccordionTrigger>
                  <AccordionContent>
                    Override any --arcana-* CSS custom property in your stylesheet.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq2">
                  <AccordionTrigger>What about TypeScript support?</AccordionTrigger>
                  <AccordionContent>
                    Full TypeScript support with exported prop interfaces.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq3" disabled>
                  <AccordionTrigger>Disabled item</AccordionTrigger>
                  <AccordionContent>
                    This content is not accessible.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Grid>
        </Section>

        {/* ─── Layout ─── */}
        <Section title="Layout">
          <p style={{ color: 'var(--arcana-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Stack, HStack, Grid, and Container layout primitives.
          </p>
          <Grid columns={2} gap={6}>
            <div>
              <p style={{ color: 'var(--arcana-text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Stack (vertical)</p>
              <Stack gap={2}>
                {['Item 1', 'Item 2', 'Item 3'].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--arcana-surface-secondary)',
                      borderRadius: 'var(--arcana-radius-md)',
                      border: '1px solid var(--arcana-border-default)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </Stack>
            </div>
            <div>
              <p style={{ color: 'var(--arcana-text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>HStack (horizontal)</p>
              <HStack gap={2}>
                {['A', 'B', 'C', 'D'].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--arcana-action-primary)',
                      color: 'var(--arcana-text-on-action)',
                      borderRadius: 'var(--arcana-radius-md)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </HStack>
            </div>
          </Grid>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--arcana-text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Grid (3 columns)</p>
            <Grid columns={3} gap={3}>
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    background: 'var(--arcana-surface-secondary)',
                    borderRadius: 'var(--arcana-radius-md)',
                    border: '1px solid var(--arcana-border-default)',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--arcana-text-secondary)',
                  }}
                >
                  Grid {i + 1}
                </div>
              ))}
            </Grid>
          </div>
        </Section>

        {/* ─── Form ─── */}
        <Section title="Form">
          <Card style={{ maxWidth: '480px' }}>
            <CardHeader title="Create Account" description="Fill in your details to get started." />
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  console.log('Form submitted')
                }}
              >
                <Stack gap={4}>
                  <FormField isRequired>
                    <FormLabel>Full name</FormLabel>
                    <Input placeholder="Jane Smith" />
                    <FormHelperText>This will be displayed on your profile.</FormHelperText>
                  </FormField>

                  <FormField isRequired isInvalid>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="jane@example.com" />
                    <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
                  </FormField>

                  <FormField>
                    <FormLabel>Bio</FormLabel>
                    <Textarea placeholder="Tell us about yourself..." autoResize />
                    <FormHelperText>Optional. Max 160 characters.</FormHelperText>
                  </FormField>

                  <FormField>
                    <Checkbox label="I agree to the Terms of Service" checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} />
                  </FormField>

                  <HStack gap={2} justify="flex-end">
                    <Button type="button" variant="secondary">Cancel</Button>
                    <Button type="submit">Create Account</Button>
                  </HStack>
                </Stack>
              </Form>
            </CardBody>
          </Card>
        </Section>

        {/* ─── Table ─── */}
        <Section title="Table">
          <Table striped hoverable>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection="asc" onSort={() => {}}>Name</TableHead>
                <TableHead sortable onSort={() => {}}>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Alice Zhao', role: 'Engineer', status: 'Active', joined: 'Jan 2024' },
                { name: 'Bob Smith', role: 'Designer', status: 'Active', joined: 'Mar 2024' },
                { name: 'Carlos R.', role: 'PM', status: 'Away', joined: 'Feb 2024' },
                { name: 'Diana P.', role: 'Engineer', status: 'Inactive', joined: 'Dec 2023' },
              ].map((user) => (
                <TableRow key={user.name}>
                  <TableCell>
                    <HStack gap={2}>
                      <Avatar name={user.name} size="sm" />
                      <span>{user.name}</span>
                    </HStack>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'Active'
                          ? 'success'
                          : user.status === 'Away'
                          ? 'warning'
                          : 'secondary'
                      }
                      dot
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: 'var(--arcana-text-secondary)' }}>{user.joined}</TableCell>
                  <TableCell>
                    <HStack gap={1}>
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">
                        <span style={{ color: 'var(--arcana-feedback-error)' }}>Delete</span>
                      </Button>
                    </HStack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* ─── Empty State ─── */}
        <Section title="Empty State">
          <Grid columns={2} gap={6}>
            <Card>
              <CardBody>
                <EmptyState
                  icon={
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 5a15 15 0 100 30A15 15 0 0020 5zM18 13h4v8h-4v-8zm0 10h4v4h-4v-4z" fill="var(--arcana-text-muted)" />
                    </svg>
                  }
                  title="No projects yet"
                  description="Get started by creating your first project."
                  action={<Button>Create project</Button>}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <EmptyState
                  size="sm"
                  title="No results found"
                  description="Try adjusting your search or filters."
                />
              </CardBody>
            </Card>
          </Grid>
        </Section>
      </Container>
    </div>
  )
}

// ─── Root App with Theme Toggle + Providers ──────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ToastProvider>
      {/* Floating theme toggle */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 999,
          filter: 'drop-shadow(var(--arcana-shadow-lg))',
        }}
      >
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <KitchenSink />
    </ToastProvider>
  )
}

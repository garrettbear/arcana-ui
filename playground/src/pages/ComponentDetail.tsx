/**
 * ComponentDetail — /playground/components/:name
 * Side-by-side layout: editing controls on the left, live preview on the right.
 * Controls include variant/size/state selectors and component token editors.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AuthorCard,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CTA,
  Card,
  CardBody,
  CardHeader,
  Carousel,
  CartItem,
  Checkbox,
  Collapsible,
  CopyButton,
  DatePicker,
  Divider,
  EmptyState,
  FeatureSection,
  FileUpload,
  Hero,
  Image,
  Input,
  KPICard,
  KeyboardShortcut,
  LogoCloud,
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
  RatingStars,
  RelatedPosts,
  ScrollArea,
  Select,
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
  Textarea,
  Timeline,
  Toggle,
} from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { type ComponentMeta, getComponentBySlug } from '../data/component-registry';
import type { TokenMapData } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';
import { getCSSVar as getCSSVarValue } from '../utils/presets';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;
import styles from './ComponentDetail.module.css';

// ─── Variant color token map ──────────────────────────────────────────────────

interface VariantTokenEntry {
  /** CSS custom property name */
  token: string;
  /** Short human-readable label */
  label: string;
  /** Fallback token to resolve current value when the primary token is unset */
  fallback?: string;
}

/**
 * Maps component slug → variant name → list of color tokens that drive that variant.
 * Used to render inline color pickers per variant in the Variants Gallery.
 */
const VARIANT_COLOR_TOKENS: Record<string, Record<string, VariantTokenEntry[]>> = {
  button: {
    primary: [
      { token: '--button-bg', label: 'Background', fallback: '--color-action-primary' },
      { token: '--button-bg-hover', label: 'Hover bg', fallback: '--color-action-primary-hover' },
      { token: '--button-fg', label: 'Text', fallback: '--color-fg-on-primary' },
    ],
    secondary: [
      { token: '--color-action-secondary', label: 'Background' },
      { token: '--color-action-secondary-hover', label: 'Hover bg' },
      { token: '--color-fg-primary', label: 'Text' },
      { token: '--color-border-default', label: 'Border' },
    ],
    ghost: [
      { token: '--color-action-ghost', label: 'Background' },
      { token: '--color-action-ghost-hover', label: 'Hover bg' },
      { token: '--color-fg-primary', label: 'Text' },
    ],
    destructive: [
      { token: '--color-action-destructive', label: 'Background' },
      { token: '--color-action-destructive-hover', label: 'Hover bg' },
      { token: '--color-fg-on-primary', label: 'Text' },
    ],
    outline: [
      { token: '--color-action-outline', label: 'Background' },
      { token: '--color-action-outline-hover', label: 'Hover bg' },
      { token: '--color-action-primary', label: 'Border / Text' },
    ],
  },
  badge: {
    default: [
      { token: '--color-bg-subtle', label: 'Background' },
      { token: '--color-fg-secondary', label: 'Text' },
      { token: '--color-border-default', label: 'Border' },
    ],
    secondary: [
      { token: '--color-bg-subtle', label: 'Background' },
      { token: '--color-fg-muted', label: 'Text' },
    ],
    success: [
      { token: '--color-status-success-bg', label: 'Background' },
      { token: '--color-status-success-fg', label: 'Text' },
      { token: '--color-status-success-border', label: 'Border' },
    ],
    warning: [
      { token: '--color-status-warning-bg', label: 'Background' },
      { token: '--color-status-warning-fg', label: 'Text' },
      { token: '--color-status-warning-border', label: 'Border' },
    ],
    error: [
      { token: '--color-status-error-bg', label: 'Background' },
      { token: '--color-status-error-fg', label: 'Text' },
      { token: '--color-status-error-border', label: 'Border' },
    ],
    info: [
      { token: '--color-status-info-bg', label: 'Background' },
      { token: '--color-status-info-fg', label: 'Text' },
      { token: '--color-status-info-border', label: 'Border' },
    ],
  },
  alert: {
    info: [
      { token: '--color-status-info-bg', label: 'Background' },
      { token: '--color-status-info-fg', label: 'Text' },
      { token: '--color-status-info-border', label: 'Border' },
    ],
    success: [
      { token: '--color-status-success-bg', label: 'Background' },
      { token: '--color-status-success-fg', label: 'Text' },
      { token: '--color-status-success-border', label: 'Border' },
    ],
    warning: [
      { token: '--color-status-warning-bg', label: 'Background' },
      { token: '--color-status-warning-fg', label: 'Text' },
      { token: '--color-status-warning-border', label: 'Border' },
    ],
    error: [
      { token: '--color-status-error-bg', label: 'Background' },
      { token: '--color-status-error-fg', label: 'Text' },
      { token: '--color-status-error-border', label: 'Border' },
    ],
  },
  'progress-bar': {
    primary: [
      { token: '--progress-fill-color', label: 'Fill', fallback: '--color-action-primary' },
      { token: '--progress-bg', label: 'Track', fallback: '--color-bg-surface' },
    ],
    success: [
      { token: '--color-status-success-fg', label: 'Fill' },
      { token: '--progress-bg', label: 'Track', fallback: '--color-bg-surface' },
    ],
    warning: [
      { token: '--color-status-warning-fg', label: 'Fill' },
      { token: '--progress-bg', label: 'Track', fallback: '--color-bg-surface' },
    ],
    error: [
      { token: '--color-status-error-fg', label: 'Fill' },
      { token: '--progress-bg', label: 'Track', fallback: '--color-bg-surface' },
    ],
  },
  banner: {
    info: [
      { token: '--color-status-info-bg', label: 'Background' },
      { token: '--color-status-info-fg', label: 'Text' },
    ],
    success: [
      { token: '--color-status-success-bg', label: 'Background' },
      { token: '--color-status-success-fg', label: 'Text' },
    ],
    warning: [
      { token: '--color-status-warning-bg', label: 'Background' },
      { token: '--color-status-warning-fg', label: 'Text' },
    ],
    error: [
      { token: '--color-status-error-bg', label: 'Background' },
      { token: '--color-status-error-fg', label: 'Text' },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tokenCategory(token: string): string {
  if (token.startsWith('--color-')) return 'color';
  if (
    token.startsWith('--font-') ||
    token.startsWith('--line-height') ||
    token.startsWith('--letter-spacing')
  )
    return 'typography';
  if (token.startsWith('--spacing-')) return 'spacing';
  if (token.startsWith('--shadow-') || token.startsWith('--elevation-')) return 'elevation';
  if (token.startsWith('--radius-') || token.startsWith('--border-')) return 'shape';
  if (
    token.startsWith('--duration-') ||
    token.startsWith('--ease-') ||
    token.startsWith('--transition-')
  )
    return 'motion';
  if (token.startsWith('--opacity-')) return 'opacity';
  if (token.startsWith('--focus-')) return 'shape';
  return 'other';
}

function tokenToUrlPath(token: string): string {
  const name = token.replace(/^--/, '');
  const cat = tokenCategory(token);
  const tokenName = name.replace(new RegExp(`^${cat}-`), '');
  return `/playground/tokens/${cat}/${tokenName || name}`;
}

// getCSSVarValue imported from presets (at top of file)

function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

// ─── Component Renderer ───────────────────────────────────────────────────────

function RenderComponent({
  slug,
  variant,
  size,
  disabled,
  loading,
}: {
  slug: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const p: Record<string, unknown> = {};
  if (variant) p.variant = variant;
  if (size) p.size = size;
  if (disabled) p.disabled = true;
  if (loading) p.loading = true;

  switch (slug) {
    case 'button': {
      const isIconSize = typeof size === 'string' && size.startsWith('icon');
      const iconSvg = (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
      if (isIconSize) {
        return (
          <Button {...p} aria-label="Add item">
            {iconSvg}
          </Button>
        );
      }
      return <Button {...p}>{variant || 'Button'}</Button>;
    }
    case 'badge':
      return <Badge {...p}>{variant || 'Badge'}</Badge>;
    case 'input':
      return <Input {...p} placeholder="Enter text..." />;
    case 'textarea':
      return <Textarea {...p} placeholder="Write something..." rows={3} />;
    case 'select':
      return (
        <Select {...p}>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </Select>
      );
    case 'checkbox':
      return <Checkbox {...p} label="Accept terms" defaultChecked />;
    case 'radio':
      return <Radio {...p} label="Select this option" name="demo-radio" />;
    case 'toggle':
      return <Toggle {...p} label="Enable notifications" defaultChecked />;
    case 'avatar':
      return <Avatar {...p} initials="AB" />;
    case 'card':
      return (
        <Card {...p} style={{ maxWidth: 280 }}>
          <CardHeader>Card Title</CardHeader>
          <CardBody>Card body content goes here. This is a preview of the Card component.</CardBody>
        </Card>
      );
    case 'alert':
      return (
        <Alert {...p} title={`${variant || 'Info'} alert`}>
          This is an alert message with details.
        </Alert>
      );
    case 'tabs':
      return (
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">Overview</Tab>
            <Tab value="tab2">Details</Tab>
            <Tab value="tab3">Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="tab1">Overview content</TabPanel>
            <TabPanel value="tab2">Details content</TabPanel>
            <TabPanel value="tab3">Settings content</TabPanel>
          </TabPanels>
        </Tabs>
      );
    case 'accordion':
      return (
        <Accordion>
          <AccordionItem value="1">
            <AccordionTrigger>What is Arcana UI?</AccordionTrigger>
            <AccordionContent>A token-driven design system.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>How does theming work?</AccordionTrigger>
            <AccordionContent>One JSON file controls everything.</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case 'progress-bar':
      return <ProgressBar {...p} value={65} showValue />;
    case 'spinner':
      return <Spinner {...p} />;
    case 'skeleton':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
          <Skeleton {...p} width="100%" height={16} />
          <Skeleton {...p} width="80%" height={16} />
          <Skeleton {...p} width="60%" height={16} />
        </div>
      );
    case 'banner':
      return <Banner {...p}>Important announcement goes here.</Banner>;
    case 'pagination':
      return <Pagination {...p} totalPages={5} currentPage={2} onPageChange={() => {}} />;
    case 'divider':
      return (
        <div style={{ width: '100%' }}>
          <p style={{ margin: '0 0 8px' }}>Above</p>
          <Divider {...p} />
          <p style={{ margin: '8px 0 0' }}>Below</p>
        </div>
      );
    case 'spacer':
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge>Before</Badge>
          <Spacer size="lg" />
          <Badge>After</Badge>
        </div>
      );
    case 'breadcrumb':
      return (
        <Breadcrumb>
          <BreadcrumbItem>
            <span>Home</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>Products</span>
          </BreadcrumbItem>
          <BreadcrumbItem active>Details</BreadcrumbItem>
        </Breadcrumb>
      );
    case 'stat-card':
      return (
        <StatCard title="Revenue" value="$12,450" trend={{ value: 12.5, direction: 'up' }} {...p} />
      );
    case 'kpi-card':
      return (
        <KPICard
          title="Conversion Rate"
          value="3.24%"
          trend={{ value: 0.5, direction: 'up', label: 'vs last month' }}
          {...p}
        />
      );
    case 'stats-bar':
      return (
        <StatsBar
          items={[
            { label: 'Users', value: '2.4k' },
            { label: 'Revenue', value: '$18k' },
            { label: 'Growth', value: '+12%' },
          ]}
          {...p}
        />
      );
    case 'copy-button':
      return <CopyButton value="npm install @arcana-ui/core" label="Copy install command" />;
    case 'keyboard-shortcut':
      return <KeyboardShortcut keys={['Cmd', 'K']} />;
    case 'empty-state':
      return (
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filters."
          {...p}
        />
      );
    case 'hero':
      return (
        <Hero
          headline="Build faster with Arcana"
          subheadline="Token-driven design system for AI agents."
          cta={[{ label: 'Get Started', variant: 'primary' }]}
          {...p}
        />
      );
    case 'pricing-card':
      return (
        <PricingCard
          title="Pro"
          price="$29"
          period="/mo"
          features={[
            { label: 'Unlimited components', included: true },
            { label: 'Custom themes', included: true },
            { label: 'Priority support', included: false },
          ]}
          cta={{ label: 'Start trial' }}
          {...p}
        />
      );
    case 'testimonial':
      return (
        <div className={styles.testimonialWrap}>
          Testimonial component — displays customer quotes with attribution.
        </div>
      );
    case 'cta':
      return (
        <CTA
          headline="Ready to get started?"
          description="Join thousands of developers."
          actions={[{ label: 'Sign up free' }]}
          {...p}
        />
      );
    case 'timeline':
      return (
        <Timeline
          items={[
            { title: 'Step 1', description: 'Install package' },
            { title: 'Step 2', description: 'Configure theme' },
            { title: 'Step 3', description: 'Build UI' },
          ]}
          {...p}
        />
      );
    case 'product-card':
      return (
        <ProductCard
          name="Premium Widget"
          price={{ amount: 49.99, currency: 'USD' }}
          image="https://placehold.co/280x200/e2e8f0/64748b?text=Product"
          {...p}
        />
      );
    case 'cart-item':
      return (
        <CartItem
          name="Widget Pro"
          price={29.99}
          quantity={2}
          image="https://placehold.co/80x80/e2e8f0/64748b?text=Item"
          onRemove={() => {}}
          onQuantityChange={() => {}}
          {...p}
        />
      );
    case 'quantity-selector':
      return <QuantitySelector value={1} onChange={() => {}} min={1} max={10} {...p} />;
    case 'price-display':
      return <PriceDisplay amount={99.99} currency="USD" {...p} />;
    case 'rating-stars':
      return <RatingStars value={4} max={5} {...p} />;
    case 'author-card':
      return (
        <AuthorCard
          name="Jane Doe"
          bio="Frontend developer and design systems enthusiast."
          avatar="https://placehold.co/48x48/e2e8f0/64748b?text=JD"
          {...p}
        />
      );
    case 'pull-quote':
      return (
        <PullQuote attribution="Jane Doe" {...p}>
          Design tokens are the single source of truth for your design system.
        </PullQuote>
      );
    case 'newsletter-signup':
      return (
        <NewsletterSignup
          title="Stay updated"
          description="Get the latest news."
          onSubmit={() => {}}
          {...p}
        />
      );
    case 'collapsible':
      return (
        <Collapsible title="Show details" {...p}>
          <p>Here are the hidden details revealed on expand.</p>
        </Collapsible>
      );
    case 'date-picker':
      return <DatePicker {...p} />;
    case 'file-upload':
      return <FileUpload onFilesChange={() => {}} {...p} />;
    case 'scroll-area':
      return (
        <ScrollArea style={{ height: 120 }} {...p}>
          <div style={{ padding: 8 }}>
            {Array.from({ length: 8 }, (_, idx) => (
              <p key={`scroll-line-${idx + 1}`} style={{ margin: '4px 0' }}>
                Scrollable content line {idx + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      );
    case 'image':
      return (
        <Image
          src="https://placehold.co/320x180/e2e8f0/64748b?text=Image"
          alt="Demo image"
          width={320}
          height={180}
          {...p}
        />
      );
    case 'carousel':
      return (
        <Carousel {...p}>
          <div
            style={{
              padding: 24,
              background: 'var(--color-bg-surface)',
              textAlign: 'center',
            }}
          >
            Slide 1
          </div>
          <div
            style={{
              padding: 24,
              background: 'var(--color-bg-surface)',
              textAlign: 'center',
            }}
          >
            Slide 2
          </div>
          <div
            style={{
              padding: 24,
              background: 'var(--color-bg-surface)',
              textAlign: 'center',
            }}
          >
            Slide 3
          </div>
        </Carousel>
      );
    case 'popover':
      return (
        <Popover
          trigger={<Button size="sm">Open Popover</Button>}
          content={<div style={{ padding: 12 }}>Popover content here</div>}
          {...p}
        />
      );
    case 'logo-cloud':
      return (
        <LogoCloud
          logos={[
            { name: 'Acme', src: 'https://placehold.co/100x40/e2e8f0/64748b?text=Acme' },
            { name: 'Corp', src: 'https://placehold.co/100x40/e2e8f0/64748b?text=Corp' },
          ]}
          {...p}
        />
      );
    default:
      return (
        <div className={styles.genericPlaceholder}>
          <code>
            {'<'}
            {slugToDisplayName(slug)}
            {' />'}
          </code>
          <span className={styles.placeholderHint}>Interactive preview not yet available</span>
        </div>
      );
  }
}

// ─── Controls Panel ──────────────────────────────────────────────────────────

function ControlsPanel({
  meta,
  variant,
  setVariant,
  size,
  setSize,
  disabled,
  setDisabled,
  loading,
  setLoading,
  tokenOverrides,
  onTokenChange,
  onTokenReset,
}: {
  meta: ComponentMeta;
  variant: string;
  setVariant: (v: string) => void;
  size: string;
  setSize: (s: string) => void;
  disabled: boolean;
  setDisabled: (d: boolean) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  tokenOverrides: Record<string, string>;
  onTokenChange: (token: string, value: string) => void;
  onTokenReset: () => void;
}) {
  const tokenData = tokenMapData.components[meta.tokenMapKey];
  const componentTokens: string[] = tokenData?.componentTokens || [];
  const semanticTokens: string[] = tokenData?.semanticTokens || [];
  const hasOverrides = Object.keys(tokenOverrides).length > 0;

  return (
    <div className={styles.controlsPanel}>
      {/* Props section */}
      <div className={styles.controlsSection}>
        <h3 className={styles.controlsSectionTitle}>Props</h3>

        {meta.variants && meta.variants.length > 0 && (
          <div className={styles.controlRow}>
            <label className={styles.controlLabel} htmlFor="ctrl-variant">
              variant
            </label>
            <select
              id="ctrl-variant"
              className={styles.nativeSelect}
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            >
              {meta.variants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}

        {meta.sizes && meta.sizes.length > 0 && (
          <div className={styles.controlRow}>
            <label className={styles.controlLabel} htmlFor="ctrl-size">
              size
            </label>
            <select
              id="ctrl-size"
              className={styles.nativeSelect}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {meta.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {meta.hasStates && (
          <>
            <div className={styles.controlRow}>
              <label className={styles.controlLabel} htmlFor="ctrl-disabled">
                disabled
              </label>
              <input
                type="checkbox"
                id="ctrl-disabled"
                className={styles.nativeCheckbox}
                checked={disabled}
                onChange={() => setDisabled(!disabled)}
              />
            </div>
            <div className={styles.controlRow}>
              <label className={styles.controlLabel} htmlFor="ctrl-loading">
                loading
              </label>
              <input
                type="checkbox"
                id="ctrl-loading"
                className={styles.nativeCheckbox}
                checked={loading}
                onChange={() => setLoading(!loading)}
              />
            </div>
          </>
        )}
      </div>

      {/* Component Tokens section */}
      {componentTokens.length > 0 && (
        <div className={styles.controlsSection}>
          <div className={styles.controlsSectionHeader}>
            <h3 className={styles.controlsSectionTitle}>Component Tokens</h3>
            {hasOverrides && (
              <button type="button" className={styles.resetButton} onClick={onTokenReset}>
                Reset
              </button>
            )}
          </div>
          <div className={styles.tokenList}>
            {componentTokens.map((token: string) => {
              const fallback = tokenData?.fallbacks?.[token] || '';
              const currentValue =
                tokenOverrides[token] || getCSSVarValue(token) || getCSSVarValue(fallback);
              const isColor =
                token.includes('bg') ||
                token.includes('fg') ||
                token.includes('color') ||
                token.includes('border-color');

              return (
                <div key={token} className={styles.tokenEditRow}>
                  <div className={styles.tokenEditLabel}>
                    <code className={styles.tokenEditName}>{token.replace(/^--/, '')}</code>
                    {tokenOverrides[token] && (
                      <span className={styles.modifiedDot} title="Modified" />
                    )}
                  </div>
                  <div className={styles.tokenEditControl}>
                    {isColor ? (
                      <div className={styles.colorEditGroup}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={tokenOverrides[token] || currentValue || '#000000'}
                          onChange={(e) => onTokenChange(token, e.target.value)}
                        />
                        <code className={styles.tokenEditValue}>
                          {tokenOverrides[token] || currentValue || '—'}
                        </code>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className={styles.textInput}
                        value={tokenOverrides[token] || ''}
                        placeholder={currentValue || 'inherited'}
                        onChange={(e) => onTokenChange(token, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Semantic Token Dependencies */}
      {semanticTokens.length > 0 && (
        <div className={styles.controlsSection}>
          <h3 className={styles.controlsSectionTitle}>
            Token Dependencies ({semanticTokens.length})
          </h3>
          <div className={styles.depList}>
            {semanticTokens.map((token) => (
              <Link key={token} to={tokenToUrlPath(token)} className={styles.depLink}>
                <code>{token.replace(/^--/, '')}</code>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Variants Gallery ────────────────────────────────────────────────────────

function VariantColorEditor({
  slug,
  variant,
  tokenOverrides,
  onTokenChange,
}: {
  slug: string;
  variant: string;
  tokenOverrides: Record<string, string>;
  onTokenChange: (token: string, value: string) => void;
}) {
  const entries = VARIANT_COLOR_TOKENS[slug]?.[variant];
  if (!entries || entries.length === 0) return null;

  return (
    <div className={styles.variantTokens}>
      {entries.map(({ token, label, fallback }) => {
        const resolved =
          tokenOverrides[token] ||
          getCSSVarValue(token) ||
          (fallback ? getCSSVarValue(fallback) : '') ||
          '#000000';
        const isModified = Boolean(tokenOverrides[token]);
        return (
          <label key={token} className={styles.variantTokenChip} title={token}>
            <span
              className={styles.variantTokenSwatch}
              style={{
                background: resolved,
                outline: isModified
                  ? '2px solid var(--color-action-primary)'
                  : '1px solid var(--color-border-default)',
              }}
            >
              <input
                type="color"
                className={styles.variantTokenColorInput}
                value={resolved.startsWith('#') ? resolved : '#000000'}
                onChange={(e) => onTokenChange(token, e.target.value)}
              />
            </span>
            <span className={styles.variantTokenLabel}>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

function VariantsGallery({
  meta,
  tokenOverrides,
  onTokenChange,
}: {
  meta: ComponentMeta;
  tokenOverrides: Record<string, string>;
  onTokenChange: (token: string, value: string) => void;
}) {
  if (!meta.variants || meta.variants.length <= 1) return null;
  const hasVariantTokens = Boolean(VARIANT_COLOR_TOKENS[meta.slug]);
  return (
    <section className={styles.gallerySection}>
      <div className={styles.gallerySectionHeader}>
        <h2 className={styles.gallerySectionTitle}>All Variants</h2>
        {hasVariantTokens && (
          <span className={styles.gallerySectionHint}>Click a color swatch to edit</span>
        )}
      </div>
      <div className={styles.galleryGrid}>
        {meta.variants.map((v) => (
          <div key={v} className={styles.galleryCard}>
            <div className={styles.galleryPreview}>
              <RenderComponent slug={meta.slug} variant={v} />
            </div>
            <div className={styles.galleryCardFooter}>
              <span className={styles.galleryLabel}>{v}</span>
              <VariantColorEditor
                slug={meta.slug}
                variant={v}
                tokenOverrides={tokenOverrides}
                onTokenChange={onTokenChange}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SizesGallery({ meta }: { meta: ComponentMeta }) {
  if (!meta.sizes || meta.sizes.length <= 1) return null;
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.gallerySectionTitle}>All Sizes</h2>
      <div className={styles.galleryGrid}>
        {meta.sizes.map((s) => (
          <div key={s} className={styles.galleryItem}>
            <div className={styles.galleryPreview}>
              <RenderComponent slug={meta.slug} size={s} />
            </div>
            <span className={styles.galleryLabel}>{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Button Shapes Gallery ───────────────────────────────────────────────────

function ButtonShapesGallery({ meta }: { meta: ComponentMeta }) {
  if (meta.slug !== 'button') return null;
  const shapes = ['default', 'circle', 'pill'] as const;
  const plusIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.gallerySectionTitle}>Shapes</h2>
      <div className={styles.galleryGrid}>
        {shapes.map((shape) => (
          <div key={shape} className={styles.galleryItem}>
            <div
              className={styles.galleryPreview}
              style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}
            >
              <Button shape={shape}>Label</Button>
              <Button shape={shape} size="icon" aria-label="Add">
                {plusIcon}
              </Button>
            </div>
            <span className={styles.galleryLabel}>{shape}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Alignment Proof ─────────────────────────────────────────────────────────

function AlignmentProof({ meta }: { meta: ComponentMeta }) {
  if (meta.slug !== 'button') return null;
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.gallerySectionTitle}>Alignment Proof</h2>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-fg-secondary)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        Button, Input, and Select at each size should share the same height.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {sizes.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span
              style={{
                width: '2rem',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-fg-muted)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {s.toUpperCase()}
            </span>
            <Button size={s}>Button</Button>
            <Input size={s} placeholder="Input" style={{ width: '10rem' }} />
            <Select size={s} options={[{ value: '1', label: 'Select' }]} value="1" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Props Reference ─────────────────────────────────────────────────────────

function PropsReferenceSection({ meta }: { meta: ComponentMeta }) {
  if (meta.props.length === 0) return null;
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.gallerySectionTitle}>Props Reference</h2>
      <div className={styles.propsTable}>
        <div className={styles.propsTableHeader}>
          <span>Prop</span>
          <span>Type</span>
          <span>Default</span>
          <span>Description</span>
        </div>
        {meta.props.map((prop) => (
          <div key={prop.name} className={styles.propsTableRow}>
            <code className={styles.propName}>
              {prop.name}
              {prop.required && <span className={styles.required}>*</span>}
            </code>
            <code className={styles.propType}>{prop.type}</code>
            <code className={styles.propDefault}>{prop.default || '—'}</code>
            <span className={styles.propDesc}>{prop.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ComponentDetail() {
  const { name } = useParams<{ name: string }>();
  const meta = useMemo(() => (name ? getComponentBySlug(name) : undefined), [name]);

  // Interactive state
  const [variant, setVariant] = useState('');
  const [size, setSize] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, string>>({});

  // Initialize variant/size when meta loads
  useMemo(() => {
    if (meta) {
      setVariant(meta.variants?.[0] || '');
      setSize(meta.sizes?.[0] || 'md');
    }
  }, [meta]);

  const handleTokenChange = (token: string, value: string) => {
    document.documentElement.style.setProperty(token, value);
    setTokenOverrides((prev) => ({ ...prev, [token]: value }));
  };

  const handleTokenReset = () => {
    for (const token of Object.keys(tokenOverrides)) {
      document.documentElement.style.removeProperty(token);
    }
    setTokenOverrides({});
  };

  if (!meta) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2>Component not found</h2>
          <p>No component matches &ldquo;{name}&rdquo;.</p>
          <Link to="/playground/components">
            <Button variant="secondary">Back to Components</Button>
          </Link>
        </div>
      </div>
    );
  }

  const importLine = `import { ${meta.importName} } from '@arcana-ui/core';`;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.componentName}>{meta.name}</h1>
            <p className={styles.componentDesc}>{meta.description}</p>
          </div>
          <div className={styles.headerBadges}>
            <Badge variant="secondary">{meta.category}</Badge>
            {meta.siteCategories.map((sc) => (
              <Badge key={sc} size="sm">
                {sc}
              </Badge>
            ))}
          </div>
        </div>
        <div className={styles.importBlock}>
          <code className={styles.importCode}>{importLine}</code>
          <CopyButton value={importLine} />
        </div>
      </header>

      {/* Main playground: controls left, preview right */}
      <div className={styles.playground}>
        <aside className={styles.controlsSidebar}>
          <ControlsPanel
            meta={meta}
            variant={variant}
            setVariant={setVariant}
            size={size}
            setSize={setSize}
            disabled={disabled}
            setDisabled={setDisabled}
            loading={loading}
            setLoading={setLoading}
            tokenOverrides={tokenOverrides}
            onTokenChange={handleTokenChange}
            onTokenReset={handleTokenReset}
          />
        </aside>

        <div className={styles.previewArea}>
          <div className={styles.previewCanvas}>
            <RenderComponent
              slug={meta.slug}
              variant={variant || undefined}
              size={size || undefined}
              disabled={disabled}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Below-fold sections */}
      <VariantsGallery
        meta={meta}
        tokenOverrides={tokenOverrides}
        onTokenChange={handleTokenChange}
      />
      <SizesGallery meta={meta} />
      <ButtonShapesGallery meta={meta} />
      <AlignmentProof meta={meta} />
      <PropsReferenceSection meta={meta} />
    </div>
  );
}

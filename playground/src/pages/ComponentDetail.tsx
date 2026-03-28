/**
 * ComponentDetail — /playground/components/:name
 * Full deep-dive page for a single component with variants, sizes, states,
 * interactive demo, component tokens, props reference, and token dependencies.
 */

import {
  Alert,
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  Checkbox,
  CopyButton,
  Divider,
  Input,
  Pagination,
  ProgressBar,
  Radio,
  Select,
  Skeleton,
  Spinner,
  Textarea,
  Toggle,
} from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { type ComponentMeta, getComponentBySlug } from '../data/component-registry';
import type { TokenMapData } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;
import styles from './ComponentDetail.module.css';

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
  // --color-bg-surface → /playground/tokens/color/bg-surface
  const name = token.replace(/^--/, '');
  const cat = tokenCategory(token);
  const tokenName = name.replace(new RegExp(`^${cat}-`), '');
  return `/playground/tokens/${cat}/${tokenName || name}`;
}

function getCSSVarValue(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
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
    case 'button':
      return <Button {...p}>{variant || 'Button'}</Button>;
    case 'badge':
      return <Badge {...p}>{variant || 'Badge'}</Badge>;
    case 'input':
      return <Input {...p} placeholder="Input text..." />;
    case 'textarea':
      return <Textarea {...p} placeholder="Enter text..." />;
    case 'select':
      return (
        <Select {...p}>
          <option>Option 1</option>
          <option>Option 2</option>
        </Select>
      );
    case 'checkbox':
      return <Checkbox {...p} label="Checkbox" defaultChecked />;
    case 'radio':
      return <Radio {...p} label="Radio" name={`demo-${variant}-${size}`} />;
    case 'toggle':
      return <Toggle {...p} label="Toggle" defaultChecked />;
    case 'avatar':
      return <Avatar {...p} initials="AB" />;
    case 'alert':
      return (
        <Alert {...p} title={`${variant || 'Info'} alert`}>
          This is an alert message.
        </Alert>
      );
    case 'progress-bar':
      return <ProgressBar {...p} value={65} showValue />;
    case 'spinner':
      return <Spinner {...p} />;
    case 'skeleton':
      return <Skeleton {...p} width={120} height={16} />;
    case 'banner':
      return <Banner {...p}>Banner message</Banner>;
    case 'pagination':
      return <Pagination {...p} totalPages={5} currentPage={2} onPageChange={() => {}} />;
    default:
      return (
        <div className={styles.genericPlaceholder}>
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

// ─── Sections ─────────────────────────────────────────────────────────────────

function OverviewSection({ meta }: { meta: ComponentMeta }) {
  const importLine = `import { ${meta.importName} } from '@arcana-ui/core';`;
  return (
    <section className={styles.section}>
      <div className={styles.overviewHeader}>
        <div>
          <h1 className={styles.componentName}>{meta.name}</h1>
          <p className={styles.componentDesc}>{meta.description}</p>
        </div>
        <div className={styles.overviewBadges}>
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
        <CopyButton text={importLine} />
      </div>
    </section>
  );
}

function VariantsSection({ meta }: { meta: ComponentMeta }) {
  if (!meta.variants || meta.variants.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Variants</h2>
      <div className={styles.variantGrid}>
        {meta.variants.map((v) => (
          <div key={v} className={styles.variantItem}>
            <div className={styles.variantPreview}>
              <RenderComponent slug={meta.slug} variant={v} />
            </div>
            <span className={styles.variantLabel}>{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SizesSection({ meta }: { meta: ComponentMeta }) {
  if (!meta.sizes || meta.sizes.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Sizes</h2>
      <div className={styles.sizeGrid}>
        {meta.sizes.map((s) => (
          <div key={s} className={styles.sizeItem}>
            <div className={styles.sizePreview}>
              <RenderComponent slug={meta.slug} size={s} />
            </div>
            <span className={styles.sizeLabel}>{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatesSection({ meta }: { meta: ComponentMeta }) {
  if (!meta.hasStates) return null;
  const states = [
    { label: 'Default', props: {} },
    { label: 'Disabled', props: { disabled: true } },
    { label: 'Loading', props: { loading: true } },
  ];
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>States</h2>
      <div className={styles.stateGrid}>
        {states.map((state) => (
          <div key={state.label} className={styles.stateItem}>
            <div className={styles.statePreview}>
              <RenderComponent slug={meta.slug} {...state.props} />
            </div>
            <span className={styles.stateLabel}>{state.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InteractiveDemoSection({ meta }: { meta: ComponentMeta }) {
  const [variant, setVariant] = useState(meta.variants?.[0] || '');
  const [size, setSize] = useState(meta.sizes?.[0] || 'md');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Interactive Demo</h2>
      <Card>
        <CardBody>
          <div className={styles.demoLayout}>
            <div className={styles.demoPreview}>
              <RenderComponent
                slug={meta.slug}
                variant={variant || undefined}
                size={size || undefined}
                disabled={disabled}
                loading={loading}
              />
            </div>
            <Divider />
            <div className={styles.demoControls}>
              {meta.variants && meta.variants.length > 0 && (
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>Variant</label>
                  <Select size="sm" value={variant} onChange={(e) => setVariant(e.target.value)}>
                    {meta.variants.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              {meta.sizes && meta.sizes.length > 0 && (
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>Size</label>
                  <Select size="sm" value={size} onChange={(e) => setSize(e.target.value)}>
                    {meta.sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              {meta.hasStates && (
                <>
                  <div className={styles.controlGroup}>
                    <Toggle
                      size="sm"
                      label="Disabled"
                      checked={disabled}
                      onChange={() => setDisabled(!disabled)}
                    />
                  </div>
                  <div className={styles.controlGroup}>
                    <Toggle
                      size="sm"
                      label="Loading"
                      checked={loading}
                      onChange={() => setLoading(!loading)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

function ComponentTokensSection({ meta }: { meta: ComponentMeta }) {
  const tokenData = tokenMapData.components[meta.tokenMapKey];
  if (!tokenData || tokenData.componentTokens.length === 0) return null;

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const handleTokenChange = (token: string, value: string) => {
    document.documentElement.style.setProperty(token, value);
    setOverrides((prev) => ({ ...prev, [token]: value }));
  };

  const resetAll = () => {
    for (const token of Object.keys(overrides)) {
      document.documentElement.style.removeProperty(token);
    }
    setOverrides({});
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Component Tokens</h2>
        {Object.keys(overrides).length > 0 && (
          <Button size="sm" variant="ghost" onClick={resetAll}>
            Reset to defaults
          </Button>
        )}
      </div>
      <div className={styles.tokenTable}>
        <div className={styles.tokenTableHeader}>
          <span>Token</span>
          <span>Fallback</span>
          <span>Current Value</span>
          <span>Edit</span>
        </div>
        {tokenData.componentTokens.map((token: string) => {
          const fallback = tokenData.fallbacks?.[token] || '—';
          const currentValue =
            overrides[token] || getCSSVarValue(token) || getCSSVarValue(fallback);
          const isColor =
            token.includes('bg') ||
            token.includes('fg') ||
            token.includes('color') ||
            token.includes('border-color');

          return (
            <div key={token} className={styles.tokenTableRow}>
              <code className={styles.tokenName}>{token}</code>
              <code className={styles.tokenFallback}>{fallback}</code>
              <span className={styles.tokenValue}>
                {isColor && currentValue && (
                  <span className={styles.colorSwatch} style={{ background: currentValue }} />
                )}
                <code>{currentValue || '(inherited)'}</code>
              </span>
              <span>
                {isColor ? (
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={overrides[token] || '#000000'}
                    onChange={(e) => handleTokenChange(token, e.target.value)}
                  />
                ) : (
                  <Input
                    size="sm"
                    value={overrides[token] || ''}
                    placeholder={currentValue}
                    onChange={(e) => handleTokenChange(token, e.target.value)}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PropsReferenceSection({ meta }: { meta: ComponentMeta }) {
  if (meta.props.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Props Reference</h2>
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

function TokenDependenciesSection({ meta }: { meta: ComponentMeta }) {
  const tokenData = tokenMapData.components[meta.tokenMapKey];
  if (!tokenData) return null;

  const semanticTokens: string[] = tokenData.semanticTokens || [];
  if (semanticTokens.length === 0) return null;

  // Group by category
  const grouped = semanticTokens.reduce<Record<string, string[]>>((acc, token) => {
    const cat = tokenCategory(token);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(token);
    return acc;
  }, {});

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Token Dependencies</h2>
      <p className={styles.sectionSubtitle}>
        Semantic tokens this component references. Click to see all affected components.
      </p>
      <div className={styles.depGroups}>
        {Object.entries(grouped).map(([category, tokens]) => (
          <div key={category} className={styles.depGroup}>
            <h3 className={styles.depGroupTitle}>{category}</h3>
            <div className={styles.depTokenList}>
              {tokens.map((token) => (
                <Link key={token} to={tokenToUrlPath(token)} className={styles.depToken}>
                  <Badge size="sm" variant="secondary">
                    {tokenCategory(token)}
                  </Badge>
                  <code>{token}</code>
                </Link>
              ))}
            </div>
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

  return (
    <div className={styles.page}>
      <OverviewSection meta={meta} />
      <VariantsSection meta={meta} />
      <SizesSection meta={meta} />
      <StatesSection meta={meta} />
      <InteractiveDemoSection meta={meta} />
      <ComponentTokensSection meta={meta} />
      <PropsReferenceSection meta={meta} />
      <TokenDependenciesSection meta={meta} />
    </div>
  );
}

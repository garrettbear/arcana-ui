/**
 * TokenImpact — /playground/tokens/:category/:name
 * Shows a single token's info, inline editor, and all affected components rendered live.
 */

import {
  Alert,
  Avatar,
  Badge,
  Banner,
  Button,
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
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COMPONENT_REGISTRY } from '../data/component-registry';
import type { TokenMapData, TokenUsage } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';
import { getCSSVar as getCSSVarValue } from '../utils/presets';
import styles from './TokenImpact.module.css';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;

/** Render a small representative version of a component */
function MiniComponent({ slug }: { slug: string }) {
  switch (slug) {
    case 'button':
      return <Button size="sm">Button</Button>;
    case 'badge':
      return <Badge size="sm">Badge</Badge>;
    case 'input':
      return <Input size="sm" placeholder="Input..." />;
    case 'textarea':
      return <Textarea size="sm" placeholder="Text..." rows={2} />;
    case 'select':
      return (
        <Select size="sm">
          <option>Select...</option>
        </Select>
      );
    case 'checkbox':
      return <Checkbox size="sm" label="Check" defaultChecked />;
    case 'radio':
      return <Radio size="sm" label="Radio" name={`mini-${slug}`} />;
    case 'toggle':
      return <Toggle size="sm" label="Toggle" defaultChecked />;
    case 'avatar':
      return <Avatar size="sm" initials="AB" />;
    case 'alert':
      return <Alert variant="info" title="Alert" />;
    case 'progress-bar':
    case 'progressbar':
      return <ProgressBar value={65} size="sm" />;
    case 'spinner':
      return <Spinner size="sm" />;
    case 'skeleton':
      return <Skeleton width={100} height={14} />;
    case 'banner':
      return <Banner variant="info">Banner</Banner>;
    case 'pagination':
      return <Pagination totalPages={3} currentPage={1} onPageChange={() => {}} size="sm" />;
    case 'divider':
      return <Divider />;
    default:
      return (
        <div className={styles.miniPlaceholder}>
          {'<'}
          {slug
            .split(/[-]/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join('')}
          {' />'}
        </div>
      );
  }
}

function findTokenByPath(
  category: string,
  name: string,
): { fullName: string; data: TokenUsage } | null {
  const possibleNames = [
    `--${category}-${name}`,
    `--${name}`,
    `--${category.replace(/s$/, '')}-${name}`,
  ];

  for (const candidate of possibleNames) {
    const data = tokenMapData.tokens[candidate];
    if (data) return { fullName: candidate, data };
  }

  // Fuzzy match: find token that ends with the name
  for (const [token, data] of Object.entries(tokenMapData.tokens)) {
    if (token.endsWith(`-${name}`) && data.category === category) {
      return { fullName: token, data };
    }
  }

  return null;
}

function getRelatedTokens(category: string, currentToken: string): string[] {
  const related: string[] = [];
  for (const [token, data] of Object.entries(tokenMapData.tokens)) {
    if (data.category === category && token !== currentToken) {
      related.push(token);
    }
  }
  return related.sort().slice(0, 20); // Limit to 20 related tokens
}

export default function TokenImpact() {
  const { category = '', name = '' } = useParams<{ category: string; name: string }>();
  const [editValue, setEditValue] = useState('');
  const [applied, setApplied] = useState(false);

  const tokenResult = useMemo(() => findTokenByPath(category, name), [category, name]);
  const currentValue = useMemo(() => {
    if (!tokenResult) return '';
    return getCSSVarValue(tokenResult.fullName);
  }, [tokenResult]);

  const relatedTokens = useMemo(() => {
    if (!tokenResult) return [];
    return getRelatedTokens(category, tokenResult.fullName);
  }, [category, tokenResult]);

  // Apply token edit in real-time
  useEffect(() => {
    if (tokenResult && editValue) {
      document.documentElement.style.setProperty(tokenResult.fullName, editValue);
      setApplied(true);
    }
    return () => {
      // Cleanup on unmount
      if (tokenResult && applied) {
        document.documentElement.style.removeProperty(tokenResult.fullName);
      }
    };
  }, [editValue, tokenResult]);

  const handleReset = () => {
    if (tokenResult) {
      document.documentElement.style.removeProperty(tokenResult.fullName);
      setEditValue('');
      setApplied(false);
    }
  };

  if (!tokenResult) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2>Token not found</h2>
          <p>
            No token matches &ldquo;{category}/{name}&rdquo;.
          </p>
          <Link to="/playground/tokens">
            <Button variant="secondary">Back to Tokens</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { fullName, data } = tokenResult;
  const isColor =
    category === 'color' ||
    fullName.includes('-bg') ||
    fullName.includes('-fg') ||
    fullName.includes('-color');
  const affectedComponents: string[] = data.usedBy || [];

  // Find fallback info
  const fallbackToken = tokenMapData.fallbackMap?.[fullName];

  return (
    <div className={styles.page}>
      {/* Section 1: Token Info */}
      <section className={styles.section}>
        <div className={styles.tokenHeader}>
          <div>
            <h1 className={styles.tokenFullName}>
              <code>{fullName}</code>
            </h1>
            <div className={styles.tokenMeta}>
              <Badge variant="secondary">{data.tier}</Badge>
              <Badge size="sm">{data.category}</Badge>
              {affectedComponents.length > 0 && (
                <span className={styles.usageCount}>
                  Used by {affectedComponents.length} component
                  {affectedComponents.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className={styles.tokenCurrentValue}>
            {isColor && currentValue && (
              <span
                className={styles.colorSwatchLarge}
                style={{ background: applied ? editValue : currentValue }}
              />
            )}
            <div>
              <span className={styles.valueLabel}>Current value</span>
              <code className={styles.valueCode}>
                {applied ? editValue : currentValue || '(inherited)'}
              </code>
            </div>
          </div>
        </div>
        {fallbackToken && (
          <div className={styles.fallbackInfo}>
            <span className={styles.fallbackLabel}>Falls back to:</span>
            <code className={styles.fallbackCode}>{fallbackToken}</code>
          </div>
        )}
        <div className={styles.copyRow}>
          <code>{fullName}</code>
          <CopyButton value={fullName} />
        </div>
      </section>

      <Divider />

      {/* Section 2: Inline Editor */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Edit Token</h2>
        <p className={styles.sectionDesc}>
          Changes update all affected components below in real-time.
        </p>
        <div className={styles.editorRow}>
          {isColor ? (
            <div className={styles.colorEditorGroup}>
              <input
                type="color"
                className={styles.colorInputLarge}
                value={editValue || currentValue || '#000000'}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <Input
                size="sm"
                placeholder={currentValue || 'Enter value...'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
          ) : (
            <Input
              placeholder={currentValue || 'Enter value...'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          )}
          {applied && (
            <Button size="sm" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </section>

      <Divider />

      {/* Section 3: Affected Components */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Affected Components</h2>
        <p className={styles.sectionDesc}>
          {affectedComponents.length === 0
            ? 'No components directly reference this token.'
            : `${affectedComponents.length} component${affectedComponents.length !== 1 ? 's' : ''} use this token. Edit the value above to see the ripple effect.`}
        </p>
        <div className={styles.affectedGrid}>
          {affectedComponents.map((compKey) => {
            // Find the component in registry by tokenMapKey
            const meta = COMPONENT_REGISTRY.find((c) => c.tokenMapKey === compKey);
            const displayName = meta?.name || compKey.charAt(0).toUpperCase() + compKey.slice(1);
            const slug = meta?.slug || compKey;

            return (
              <Link
                key={compKey}
                to={`/playground/components/${slug}`}
                className={styles.affectedCard}
              >
                <div className={styles.affectedPreview}>
                  <MiniComponent slug={compKey} />
                </div>
                <span className={styles.affectedName}>{displayName}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <Divider />

      {/* Section 4: Related Tokens */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Related Tokens</h2>
        <p className={styles.sectionDesc}>
          Other tokens in the {category} category that you might want to adjust together.
        </p>
        <div className={styles.relatedGrid}>
          {relatedTokens.map((token) => {
            const val = getCSSVarValue(token);
            const tokenName = token.replace(/^--/, '').replace(new RegExp(`^${category}-`), '');
            return (
              <Link
                key={token}
                to={`/playground/tokens/${category}/${tokenName}`}
                className={styles.relatedToken}
              >
                {isColor && val && (
                  <span className={styles.colorSwatchSmall} style={{ background: val }} />
                )}
                <code className={styles.relatedTokenName}>{token}</code>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

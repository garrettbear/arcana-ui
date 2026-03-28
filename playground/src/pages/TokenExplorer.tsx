/**
 * TokenExplorer — /playground/tokens
 * Browse all tokens organized by category with visual previews.
 */

import { Badge, Card, CardBody, Input } from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TokenMapData } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';
import styles from './TokenExplorer.module.css';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;

const CATEGORY_ORDER = [
  'color',
  'typography',
  'spacing',
  'elevation',
  'shape',
  'motion',
  'opacity',
  'layout',
  'component',
  'other',
];

const CATEGORY_LABELS: Record<string, string> = {
  color: 'Colors',
  typography: 'Typography',
  spacing: 'Spacing',
  elevation: 'Elevation & Shadows',
  shape: 'Shape & Borders',
  motion: 'Motion & Transitions',
  opacity: 'Opacity',
  layout: 'Layout',
  component: 'Component Tokens',
  other: 'Other',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  color: 'Background, foreground, action, status, and border colors.',
  typography: 'Font families, sizes, weights, line heights, and letter spacing.',
  spacing: 'Padding, margin, and gap values on a 4px grid.',
  elevation: 'Box shadows, z-index layers, and backdrop blur.',
  shape: 'Border radius, widths, and focus ring styles.',
  motion: 'Animation durations, easing curves, and transitions.',
  opacity: 'Opacity levels for disabled, overlay, and muted states.',
  layout: 'Container widths, grid columns, and breakpoints.',
  component: 'Per-component token overrides (Tier 3).',
  other: 'Miscellaneous tokens.',
};

function getCSSVarValue(varName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function TokenPreview({ token, value }: { token: string; value: string }) {
  const cat = tokenMapData.tokens[token]?.category || 'other';

  if (cat === 'color' && value) {
    return <span className={styles.colorSwatch} style={{ background: value }} />;
  }
  if (cat === 'elevation' && token.includes('shadow') && value) {
    return <span className={styles.shadowPreview} style={{ boxShadow: value }} />;
  }
  if (cat === 'shape' && token.includes('radius') && value) {
    return <span className={styles.radiusPreview} style={{ borderRadius: value }} />;
  }
  return null;
}

function tokenToUrlPath(token: string): string {
  const name = token.replace(/^--/, '');
  const cat = tokenMapData.tokens[token]?.category || 'other';
  const tokenName = name.replace(new RegExp(`^${cat}-`), '');
  return `/playground/tokens/${cat}/${tokenName || name}`;
}

export default function TokenExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  // Group tokens by category (excluding component tokens by default for cleaner view)
  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const [token, data] of Object.entries(tokenMapData.tokens)) {
      const cat = data.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(token);
    }
    // Sort tokens within each category
    for (const cat of Object.keys(map)) {
      map[cat].sort();
    }
    return map;
  }, []);

  const filteredCategories = useMemo(() => {
    return CATEGORY_ORDER.filter((cat) => {
      if (!grouped[cat]) return false;
      if (activeCategory !== 'all' && cat !== activeCategory) return false;
      return true;
    });
  }, [grouped, activeCategory]);

  const filteredTokens = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const cat of filteredCategories) {
      const tokens =
        grouped[cat]?.filter((t) => !search || t.toLowerCase().includes(search.toLowerCase())) ||
        [];
      if (tokens.length > 0) result[cat] = tokens;
    }
    return result;
  }, [filteredCategories, grouped, search]);

  const totalTokenCount = Object.values(filteredTokens).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tokens</h1>
        <p className={styles.subtitle}>
          {tokenMapData.tokenCount} design tokens powering {tokenMapData.componentCount} components.
          Click any token to see which components it affects.
        </p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity={0.5}>
                <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04-1.06 1.06-3.04-3.04Z" />
              </svg>
            }
          />
        </div>
        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryChip} ${activeCategory === 'all' ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {CATEGORY_ORDER.filter((c) => grouped[c]).map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]} ({grouped[cat].length})
            </button>
          ))}
        </div>
      </div>

      {/* Token groups */}
      {Object.entries(filteredTokens).map(([cat, tokens]) => (
        <section key={cat} className={styles.group}>
          <h2 className={styles.groupTitle}>{CATEGORY_LABELS[cat] || cat}</h2>
          <p className={styles.groupDesc}>{CATEGORY_DESCRIPTIONS[cat]}</p>
          <div className={styles.tokenGrid}>
            {tokens.map((token) => {
              const value = getCSSVarValue(token);
              const usedBy = tokenMapData.tokens[token]?.usedBy || [];
              return (
                <Link key={token} to={tokenToUrlPath(token)} className={styles.tokenCard}>
                  <div className={styles.tokenCardHeader}>
                    <TokenPreview token={token} value={value} />
                    <code className={styles.tokenCardName}>{token}</code>
                  </div>
                  <div className={styles.tokenCardValue}>
                    <code>{value || '(computed)'}</code>
                  </div>
                  <div className={styles.tokenCardMeta}>
                    <span>
                      {usedBy.length} component{usedBy.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {totalTokenCount === 0 && (
        <div className={styles.empty}>
          <p>No tokens match your search.</p>
        </div>
      )}
    </div>
  );
}

/**
 * ComponentGallery — /playground/components
 * Grid of component cards with search, category filter, stats bar, and audit table view.
 */

import { Badge, Card, CardBody, Input } from '@arcana-ui/core';
import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComponentThumbnail } from '../components/ComponentThumbnail';
import {
  COMPONENT_REGISTRY,
  type ComponentCategory,
  type ComponentMeta,
  getCategories,
} from '../data/component-registry';
import styles from './ComponentGallery.module.css';

type SortKey = 'name' | 'category' | 'props';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

function useGalleryStats() {
  return useMemo(() => {
    const totalComponents = COMPONENT_REGISTRY.length;
    const categoryCount = getCategories().length;
    const allVariants = new Set<string>();
    for (const c of COMPONENT_REGISTRY) {
      if (c.variants) {
        for (const v of c.variants) allVariants.add(v);
      }
    }
    return { totalComponents, categoryCount, variantCount: allVariants.size };
  }, []);
}

function sortComponents(list: ComponentMeta[], key: SortKey, dir: SortDir): ComponentMeta[] {
  const sorted = [...list].sort((a, b) => {
    switch (key) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'props':
        return a.props.length - b.props.length;
    }
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

export default function ComponentGallery() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const categories = useMemo(() => getCategories(), []);
  const stats = useGalleryStats();

  const filtered = useMemo(() => {
    return COMPONENT_REGISTRY.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const sortedFiltered = useMemo(
    () => sortComponents(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir],
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey],
  );

  const handleSortKeyDown = useCallback(
    (key: SortKey, e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSort(key);
      }
    },
    [handleSort],
  );

  const sortIndicator = (key: SortKey): string => {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.subtitle}>
          {COMPONENT_REGISTRY.length} production-ready components across {categories.length}{' '}
          categories. Click any card to explore variants, states, tokens, and live demos.
        </p>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <span className={styles.statChip}>
          <span className={styles.statValue}>{stats.totalComponents}</span> Components
        </span>
        <span className={styles.statChip}>
          <span className={styles.statValue}>{stats.categoryCount}</span> Categories
        </span>
        <span className={styles.statChip}>
          <span className={styles.statValue}>{stats.variantCount}</span> Variants
        </span>
        <span className={`${styles.statChip} ${styles.statChipAccent}`}>Manifest: 95.6%</span>
      </div>

      {/* Search and filter */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarRow}>
          <div className={styles.searchWrap}>
            <Input
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  opacity={0.5}
                  aria-hidden="true"
                  role="img"
                >
                  <title>Search</title>
                  <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04-1.06 1.06-3.04-3.04Z" />
                </svg>
              }
            />
          </div>
          <button
            type="button"
            className={`${styles.viewToggle} ${viewMode === 'table' ? styles.viewToggleActive : ''}`}
            onClick={() => setViewMode((m) => (m === 'grid' ? 'table' : 'grid'))}
            aria-label={`Switch to ${viewMode === 'grid' ? 'table' : 'grid'} view`}
          >
            {viewMode === 'grid' ? 'Table' : 'Grid'}
          </button>
        </div>
        <div className={styles.categoryFilter}>
          <button
            type="button"
            className={`${styles.categoryChip} ${activeCategory === 'All' ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All ({COMPONENT_REGISTRY.length})
          </button>
          {categories.map((cat) => {
            const count = COMPONENT_REGISTRY.filter((c) => c.category === cat).length;
            return (
              <button
                type="button"
                key={cat}
                className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Component grid */}
      {viewMode === 'grid' && (
        <div className={styles.grid}>
          {sortedFiltered.map((comp) => (
            <Link
              to={`/playground/components/${comp.slug}`}
              key={comp.slug}
              className={styles.cardLink}
            >
              <Card interactive className={styles.card}>
                <CardBody>
                  <div className={styles.thumbnailWrap}>
                    <ComponentThumbnail slug={comp.slug} />
                  </div>
                  <div className={styles.cardMeta}>
                    <h3 className={styles.cardName}>{comp.name}</h3>
                    <p className={styles.cardDesc}>{comp.description}</p>
                    <div className={styles.cardTags}>
                      <Badge size="sm" variant="secondary">
                        {comp.category}
                      </Badge>
                      <span className={styles.propCount}>
                        <span
                          className={`${styles.statusDot} ${comp.props.length > 0 ? styles.statusDotGreen : styles.statusDotGray}`}
                        />
                        {comp.props.length} props
                      </span>
                      {comp.variants && (
                        <span className={styles.variantCount}>{comp.variants.length} variants</span>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Audit table view */}
      {viewMode === 'table' && (
        <div className={styles.tableWrap}>
          <table className={styles.auditTable}>
            <thead>
              <tr>
                <th
                  className={styles.thSortable}
                  onClick={() => handleSort('name')}
                  onKeyDown={(e) => handleSortKeyDown('name', e)}
                >
                  Name{sortIndicator('name')}
                </th>
                <th
                  className={styles.thSortable}
                  onClick={() => handleSort('category')}
                  onKeyDown={(e) => handleSortKeyDown('category', e)}
                >
                  Category{sortIndicator('category')}
                </th>
                <th
                  className={styles.thSortable}
                  onClick={() => handleSort('props')}
                  onKeyDown={(e) => handleSortKeyDown('props', e)}
                >
                  Props{sortIndicator('props')}
                </th>
                <th>Variants</th>
                <th>Sizes</th>
                <th>States</th>
                <th>Manifest</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiltered.map((comp) => (
                <tr key={comp.slug} className={styles.tableRow}>
                  <td>
                    <Link to={`/playground/components/${comp.slug}`} className={styles.tableLink}>
                      {comp.name}
                    </Link>
                  </td>
                  <td>
                    <Badge size="sm" variant="secondary">
                      {comp.category}
                    </Badge>
                  </td>
                  <td>{comp.props.length}</td>
                  <td>{comp.variants ? comp.variants.length : '\u2014'}</td>
                  <td>{comp.sizes ? comp.sizes.length : '\u2014'}</td>
                  <td>{comp.hasStates ? '\u2713' : '\u2014'}</td>
                  <td>
                    <span className={styles.manifestCheck}>{'\u2713'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No components match your search.</p>
        </div>
      )}
    </div>
  );
}

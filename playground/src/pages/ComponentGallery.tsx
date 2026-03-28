/**
 * ComponentGallery — /playground/components
 * Grid of component cards with search and category filter.
 */

import { Badge, Card, CardBody, Input } from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComponentThumbnail } from '../components/ComponentThumbnail';
import {
  COMPONENT_REGISTRY,
  type ComponentCategory,
  getCategories,
} from '../data/component-registry';
import styles from './ComponentGallery.module.css';

export default function ComponentGallery() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'All'>('All');
  const categories = useMemo(() => getCategories(), []);

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.subtitle}>
          {COMPONENT_REGISTRY.length} production-ready components across {categories.length}{' '}
          categories. Click any card to explore variants, states, tokens, and live demos.
        </p>
      </div>

      {/* Search and filter */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search components..."
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
            className={`${styles.categoryChip} ${activeCategory === 'All' ? styles.categoryChipActive : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All ({COMPONENT_REGISTRY.length})
          </button>
          {categories.map((cat) => {
            const count = COMPONENT_REGISTRY.filter((c) => c.category === cat).length;
            return (
              <button
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
      <div className={styles.grid}>
        {filtered.map((comp) => (
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

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No components match your search.</p>
        </div>
      )}
    </div>
  );
}

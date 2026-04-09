import { Badge, Button, DataTable, Input, Select } from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { CATEGORIES, componentData, componentStats } from '../data/components';
import type { ComponentEntry } from '../data/components';

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...CATEGORIES.filter((c) => c !== 'All').map((c) => ({ value: c, label: c })),
];

const columns: ColumnDef<ComponentEntry>[] = [
  {
    key: 'name',
    header: 'Component',
    sortable: true,
    render: (_v, row) => (
      <span
        className="control-mono"
        style={{ fontSize: '12px', color: 'var(--color-action-primary)' }}
      >
        {row.name}
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (_v, row) => (
      <Badge variant="secondary" size="sm">
        {row.category}
      </Badge>
    ),
  },
  {
    key: 'tokenCount',
    header: 'Tokens',
    sortable: true,
    width: '70px',
    align: 'center' as const,
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>{row.tokenCount}</span>
    ),
  },
  {
    key: 'testCoverage',
    header: 'Coverage',
    sortable: true,
    width: '90px',
    render: (_v, row) => (
      <Badge
        variant={row.testCoverage >= 95 ? 'success' : row.testCoverage >= 90 ? 'warning' : 'error'}
        size="sm"
      >
        {row.testCoverage}%
      </Badge>
    ),
  },
  {
    key: 'bundleSize',
    header: 'Bundle',
    width: '80px',
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>{row.bundleSize}</span>
    ),
  },
  {
    key: 'wcagScore',
    header: 'WCAG',
    sortable: true,
    width: '75px',
    render: (_v, row) => (
      <Badge
        variant={row.wcagScore >= 98 ? 'success' : row.wcagScore >= 94 ? 'warning' : 'error'}
        size="sm"
      >
        {row.wcagScore}%
      </Badge>
    ),
  },
  {
    key: 'lastUpdated',
    header: 'Updated',
    sortable: false,
    width: '90px',
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
        {row.lastUpdated}
      </span>
    ),
  },
];

export function Components(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredData = useMemo(() => {
    let result = componentData;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q),
      );
    }
    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }
    return result;
  }, [search, categoryFilter]);

  const avgCoverage = Math.round(
    componentData.reduce((s, c) => s + c.testCoverage, 0) / componentData.length,
  );
  const avgWcag = Math.round(
    componentData.reduce((s, c) => s + c.wcagScore, 0) / componentData.length,
  );

  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Component Registry</h1>
          <span className="control-page-header__subtitle">
            {componentStats.total} components · avg coverage {avgCoverage}% · avg WCAG {avgWcag}%
          </span>
        </div>
        <div className="control-page-header__actions">
          <Button variant="ghost" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="control-filters">
        <div className="control-filters__input">
          <Input
            placeholder="Search components…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
          />
        </div>
        <div className="control-filters__select">
          <Select
            placeholder="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(v) => setCategoryFilter(v as string)}
            size="sm"
          />
        </div>
        <Badge variant="secondary">
          {filteredData.length} / {componentStats.total}
        </Badge>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        sortable
        hoverable
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

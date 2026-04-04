import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { ComponentDrawer } from '../components/ComponentDrawer';
import { componentData, componentStats } from '../data/components';
import type { ComponentEntry } from '../data/components';

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Primitives', label: 'Primitives' },
  { value: 'Composites', label: 'Composites' },
  { value: 'Patterns', label: 'Patterns' },
  { value: 'Layout', label: 'Layout' },
  { value: 'Context', label: 'Context' },
  { value: 'Components', label: 'Components' },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'warning', label: 'Warning' },
  { value: 'missing-tests', label: 'Missing Tests' },
];

export function Components(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredData = useMemo(() => {
    let result = componentData;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(lower));
    }

    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (activeTab !== 'all') {
      const tabCategory = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      result = result.filter((c) => c.category === tabCategory);
    }

    if (statusFilter === 'warning' || statusFilter === 'missing-tests' || showWarningsOnly) {
      result = result.filter((c) => !c.tests || !c.manifest);
    }

    return result;
  }, [search, categoryFilter, statusFilter, activeTab, showWarningsOnly]);

  const columns: ColumnDef<ComponentEntry>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_v, row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedComponent(row);
            setDrawerOpen(true);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--font-size-sm, 0.875rem)',
            color: 'var(--color-action-primary)',
            padding: 0,
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          {row.name}
        </button>
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
      key: 'props',
      header: 'Props',
      sortable: true,
      width: '80px',
      align: 'center' as const,
    },
    {
      key: 'variants',
      header: 'Variants',
      width: '90px',
      align: 'center' as const,
    },
    {
      key: 'tests',
      header: 'Tests',
      width: '80px',
      render: (_v, row) => (
        <Badge variant={row.tests ? 'success' : 'warning'} size="sm">
          {row.tests ? '✓' : '✗'}
        </Badge>
      ),
    },
    {
      key: 'manifest',
      header: 'Manifest',
      width: '90px',
      render: (_v, row) => (
        <Badge variant={row.manifest ? 'success' : 'warning'} size="sm">
          {row.manifest ? '✓' : '✗'}
        </Badge>
      ),
    },
    {
      key: 'lastUpdated',
      header: 'Updated',
      sortable: true,
      width: '100px',
    },
  ];

  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Component Registry</h1>
          <span className="control-page-header__subtitle">
            {componentStats.total} components · Last audited: 2026-04-03
          </span>
        </div>
        <div className="control-page-header__actions">
          <Button variant="ghost" size="sm">
            Export JSON
          </Button>
        </div>
      </div>

      <div className="control-filters">
        <div className="control-filters__input">
          <Input
            placeholder="Search components..."
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
        <div className="control-filters__select">
          <Select
            placeholder="Status"
            options={statusOptions}
            onChange={(v) => setStatusFilter(v as string)}
            size="sm"
          />
        </div>
        <Checkbox
          label="Show only warnings"
          checked={showWarningsOnly}
          onChange={(e) => setShowWarningsOnly(e.target.checked)}
        />
      </div>

      <Tabs value={activeTab} onChange={setActiveTab} variant="line">
        <TabList>
          <Tab value="all">All ({componentStats.total})</Tab>
          <Tab value="primitives">Primitives ({componentStats.categories.primitives})</Tab>
          <Tab value="composites">Composites ({componentStats.categories.composites})</Tab>
          <Tab value="patterns">Patterns ({componentStats.categories.patterns})</Tab>
          <Tab value="other">
            Other ({componentStats.categories.layout + componentStats.categories.context})
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="all">
            <DataTable
              data={filteredData}
              columns={columns}
              sortable
              hoverable
              onRowClick={(row) => {
                setSelectedComponent(row);
                setDrawerOpen(true);
              }}
            />
          </TabPanel>
          <TabPanel value="primitives">
            <DataTable
              data={filteredData}
              columns={columns}
              sortable
              hoverable
              onRowClick={(row) => {
                setSelectedComponent(row);
                setDrawerOpen(true);
              }}
            />
          </TabPanel>
          <TabPanel value="composites">
            <DataTable
              data={filteredData}
              columns={columns}
              sortable
              hoverable
              onRowClick={(row) => {
                setSelectedComponent(row);
                setDrawerOpen(true);
              }}
            />
          </TabPanel>
          <TabPanel value="patterns">
            <DataTable
              data={filteredData}
              columns={columns}
              sortable
              hoverable
              onRowClick={(row) => {
                setSelectedComponent(row);
                setDrawerOpen(true);
              }}
            />
          </TabPanel>
          <TabPanel value="other">
            <DataTable
              data={filteredData}
              columns={columns}
              sortable
              hoverable
              onRowClick={(row) => {
                setSelectedComponent(row);
                setDrawerOpen(true);
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ComponentDrawer
        component={selectedComponent}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

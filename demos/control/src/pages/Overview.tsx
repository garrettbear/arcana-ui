import {
  Alert,
  Avatar,
  Badge,
  Banner,
  Button,
  DataTable,
  KPICard,
  useToast,
} from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityData } from '../data/activity';
import { componentData } from '../data/components';

const activityColumns: ColumnDef<(typeof activityData)[0]>[] = [
  {
    key: 'message',
    header: 'Commit',
    render: (_value, row) => <span className="control-mono">{row.message}</span>,
  },
  {
    key: 'author',
    header: 'Author',
    width: '120px',
    render: (_value, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
        <Avatar name={row.author} size="xs" />
        {row.author}
      </span>
    ),
  },
  { key: 'time', header: 'Time', width: '100px' },
  {
    key: 'status',
    header: 'Status',
    width: '100px',
    render: (_value, row) => {
      const variant =
        row.status === 'success' ? 'success' : row.status === 'warning' ? 'warning' : 'info';
      return (
        <Badge variant={variant} size="sm">
          {row.status}
        </Badge>
      );
    },
  },
];

const healthColumns: ColumnDef<(typeof componentData)[0]>[] = [
  {
    key: 'name',
    header: 'Component',
    render: (_v, row) => <span className="control-mono">{row.name}</span>,
  },
  {
    key: 'category',
    header: 'Category',
    render: (_v, row) => (
      <Badge variant="secondary" size="sm">
        {row.category}
      </Badge>
    ),
  },
  { key: 'props', header: 'Props', width: '80px', align: 'center' as const },
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
  { key: 'lastUpdated', header: 'Updated', width: '100px' },
];

interface AlertState {
  id: string;
  variant: 'warning' | 'info';
  title: string;
  message: string;
  resolved: boolean;
}

export function Overview(): React.JSX.Element {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertState[]>([
    {
      id: '1',
      variant: 'warning',
      title: 'ThemeProvider.defaultTheme prop type',
      message: 'Was missing 8 themes in manifest',
      resolved: true,
    },
    {
      id: '2',
      variant: 'info',
      title: 'manifest.ai.json sync',
      message: 'Was 4.2% out of sync with source — regenerated',
      resolved: true,
    },
    {
      id: '3',
      variant: 'warning',
      title: 'Build time above threshold',
      message: 'demos/ecommerce build time: 34s (above 30s threshold)',
      resolved: false,
    },
  ]);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  const handleRunAudit = (): void => {
    toast({
      title: 'Audit started',
      description: 'Results in ~30s.',
      variant: 'default',
      duration: 4000,
    });
  };

  const handleDismissAlert = (id: string): void => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  return (
    <div>
      {activeAlerts.length > 0 && (
        <Banner
          variant="warning"
          dismissible
          onDismiss={() => handleDismissAlert(activeAlerts[0].id)}
        >
          {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}.{' '}
          {activeAlerts[0].message}.
        </Banner>
      )}

      <div
        className="control-page-header"
        style={{ marginTop: activeAlerts.length > 0 ? 'var(--spacing-4, 16px)' : undefined }}
      >
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Overview</h1>
          <span className="control-page-header__subtitle">April 3, 2026</span>
        </div>
        <div className="control-page-header__actions">
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            ↻ Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleRunAudit}>
            Run Audit
          </Button>
        </div>
      </div>

      <div className="control-stats-grid">
        <KPICard
          value={68}
          label="Total Components"
          trend={{ value: 2, direction: 'up' }}
          period="this week"
        />
        <KPICard
          value="100"
          suffix="%"
          label="Test Coverage"
          trend={{ value: 0, direction: 'neutral' }}
          period="stable"
        />
        <KPICard
          value="95.6"
          suffix="%"
          label="Manifest Coverage"
          trend={{ value: 4.4, direction: 'up' }}
          period="this week"
        />
        <KPICard
          value={0}
          label="Open Issues"
          trend={{ value: 3, direction: 'down' }}
          period="this week"
        />
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Recent Activity</h2>
        </div>
        <DataTable data={activityData} columns={activityColumns} hoverable />
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Component Health</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/components')}>
            View All →
          </Button>
        </div>
        <DataTable data={componentData.slice(0, 5)} columns={healthColumns} hoverable />
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Alerts</h2>
        </div>
        <div className="control-alerts">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.resolved ? 'info' : alert.variant}
              title={alert.title}
              onClose={!alert.resolved ? () => handleDismissAlert(alert.id) : undefined}
            >
              {alert.message}{' '}
              {alert.resolved && (
                <Badge variant="secondary" size="sm">
                  Resolved
                </Badge>
              )}
            </Alert>
          ))}
        </div>
      </div>
    </div>
  );
}

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
import { componentData, componentStats } from '../data/components';
import { downloadData, totalDownloads30d } from '../data/metrics';

// ─── Mini sparkline SVG ───────────────────────────────────────────────────────
function Sparkline({
  data,
  color = '#7c3aed',
}: { data: number[]; color?: string }): React.JSX.Element {
  const w = 80;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Download line chart ──────────────────────────────────────────────────────
function DownloadChart(): React.JSX.Element {
  const w = 100;
  const h = 100; // viewBox units
  const data = downloadData.map((d) => d.downloads);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const pad = { top: 8, right: 4, bottom: 16, left: 32 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const pts = data
    .map((v, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw;
      const y = pad.top + ch - ((v - min) / range) * ch;
      return `${x},${y}`;
    })
    .join(' ');

  // Fill area
  const firstX = pad.left;
  const lastX = pad.left + cw;
  const baseY = pad.top + ch;
  const areaPoints = `${firstX},${baseY} ${pts} ${lastX},${baseY}`;

  // Y axis labels
  const yLabels = [min, Math.round(min + range / 2), max].map((v, i) => ({
    v,
    y: pad.top + ch - (i * ch) / 2,
  }));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', height: '160px' }}
      role="img"
      aria-label="npm downloads over 30 days"
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad.left}
          x2={pad.left + cw}
          y1={pad.top + ch * (1 - t)}
          y2={pad.top + ch * (1 - t)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {/* Area fill */}
      <polygon points={areaPoints} fill="rgba(124,58,237,0.12)" />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Y labels */}
      {yLabels.map(({ v, y }) => (
        <text
          key={v}
          x={pad.left - 2}
          y={y + 1}
          textAnchor="end"
          fontSize="4"
          fill="rgba(161,161,170,0.8)"
        >
          {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
        </text>
      ))}
      {/* X labels */}
      {[1, 10, 20, 30].map((d) => (
        <text
          key={d}
          x={pad.left + ((d - 1) / 29) * cw}
          y={h - 3}
          textAnchor="middle"
          fontSize="4"
          fill="rgba(161,161,170,0.8)"
        >
          Day {d}
        </text>
      ))}
    </svg>
  );
}

// ─── Category bar chart ───────────────────────────────────────────────────────
function CategoryBarChart(): React.JSX.Element {
  const data = Object.entries(componentStats.categoryCounts);
  const maxVal = Math.max(...data.map(([, v]) => v));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {data.map(([cat, count]) => (
        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-fg-secondary)',
              width: '90px',
              flexShrink: 0,
              textAlign: 'right',
            }}
          >
            {cat}
          </span>
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '2px',
              height: '14px',
            }}
          >
            <div
              style={{
                width: `${(count / maxVal) * 100}%`,
                height: '100%',
                background: 'var(--color-action-primary)',
                borderRadius: '2px',
                transition: 'width 600ms ease',
              }}
            />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-fg-secondary)', width: '18px' }}>
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Table columns ────────────────────────────────────────────────────────────

const activityColumns: ColumnDef<(typeof activityData)[0]>[] = [
  {
    key: 'message',
    header: 'Commit',
    render: (_v, row) => (
      <span className="control-mono" style={{ fontSize: '12px' }}>
        {row.message}
      </span>
    ),
  },
  {
    key: 'author',
    header: 'Author',
    width: '100px',
    render: (_v, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Avatar name={row.author} size="xs" />
        <span style={{ fontSize: '12px' }}>{row.author}</span>
      </span>
    ),
  },
  {
    key: 'time',
    header: 'When',
    width: '110px',
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>{row.time}</span>
    ),
  },
  {
    key: 'status',
    header: '',
    width: '80px',
    render: (_v, row) => (
      <Badge
        variant={
          row.status === 'success' ? 'success' : row.status === 'warning' ? 'warning' : 'secondary'
        }
        size="sm"
      >
        {row.status}
      </Badge>
    ),
  },
];

const healthColumns: ColumnDef<(typeof componentData)[0]>[] = [
  {
    key: 'name',
    header: 'Component',
    render: (_v, row) => (
      <span className="control-mono" style={{ fontSize: '12px' }}>
        {row.name}
      </span>
    ),
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
  {
    key: 'testCoverage',
    header: 'Coverage',
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
    key: 'lastUpdated',
    header: 'Updated',
    width: '90px',
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
        {row.lastUpdated}
      </span>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      message: 'Was missing 8 themes in manifest — regenerated',
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

  function handleDismissAlert(id: string): void {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  }

  const downloadSparkline = downloadData.map((d) => d.downloads);

  return (
    <div>
      {activeAlerts.length > 0 && (
        <Banner
          variant="warning"
          dismissible
          onDismiss={() => handleDismissAlert(activeAlerts[0].id)}
        >
          {activeAlerts[0].title}: {activeAlerts[0].message}
        </Banner>
      )}

      <div
        className="control-page-header"
        style={{ marginTop: activeAlerts.length > 0 ? '16px' : undefined }}
      >
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Overview</h1>
          <span className="control-page-header__subtitle">April 8, 2026</span>
        </div>
        <div className="control-page-header__actions">
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            ↻ Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              toast({ title: 'Audit started', description: 'Results in ~30s.', duration: 4000 })
            }
          >
            Run Audit
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="control-stats-grid">
        <KPICard
          value={63}
          label="Components"
          trend={{ value: 3, direction: 'up' }}
          period="this month"
        />
        <KPICard
          value="2,600"
          suffix="+"
          label="CSS Variables"
          trend={{ value: 14, direction: 'up' }}
          period="this month"
        />
        <KPICard
          value={14}
          label="Theme Presets"
          trend={{ value: 2, direction: 'up' }}
          period="this month"
        />
        <KPICard
          value="94.2"
          suffix="%"
          label="Test Coverage"
          trend={{ value: 6.2, direction: 'up' }}
          period="vs last month"
        />
      </div>

      {/* Charts row */}
      <div className="control-charts-grid">
        <div className="control-section">
          <div className="control-section__header">
            <h2 className="control-section__title">npm Downloads</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
              {totalDownloads30d.toLocaleString()} total · last 30 days
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Sparkline data={downloadSparkline} color="#7c3aed" />
            <DownloadChart />
          </div>
        </div>

        <div className="control-section">
          <div className="control-section__header">
            <h2 className="control-section__title">Components by Category</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
              {componentStats.total} total
            </span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <CategoryBarChart />
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Recent Activity</h2>
          <Badge variant="secondary" size="sm">
            {activityData.length} commits
          </Badge>
        </div>
        <DataTable data={activityData} columns={activityColumns} hoverable />
      </div>

      {/* Component health */}
      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Component Health</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/components')}>
            View All →
          </Button>
        </div>
        <DataTable data={componentData.slice(0, 6)} columns={healthColumns} hoverable />
      </div>

      {/* Alerts */}
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

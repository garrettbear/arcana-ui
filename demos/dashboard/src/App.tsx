import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  DataTable,
  KPICard,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  ProgressBar,
} from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { useState } from 'react';
import './App.css';

// ─── Data ─────────────────────────────────────────────────────────────────────

const kpiSparkline7d = [1840, 1920, 1870, 2100, 2050, 2210, 2340];
const kpiSparklineRev = [38200, 40100, 39400, 41800, 43200, 44900, 46100];
const kpiSparklineSessions = [8200, 7900, 8500, 9100, 8700, 9300, 9840];
const kpiSparklineChurn = [2.4, 2.3, 2.5, 2.2, 2.1, 2.0, 1.8];

const activityData7d = [820, 940, 880, 1020, 960, 1100, 1180];
const activityData30d = Array.from({ length: 30 }, (_, i) =>
  Math.round(600 + Math.sin(i * 0.4) * 200 + i * 18 + Math.random() * 80),
);
const activityData90d = Array.from({ length: 90 }, (_, i) =>
  Math.round(400 + Math.sin(i * 0.15) * 300 + i * 6 + Math.random() * 100),
);

const revenueByPlan = [
  { label: 'Starter', value: 12400, color: 'var(--color-action-primary)' },
  { label: 'Pro', value: 24800, color: 'var(--meridian-chart-2)' },
  { label: 'Enterprise', value: 9700, color: 'var(--meridian-chart-3)' },
];

const segmentData = [
  { label: 'Trial', value: 21, color: 'var(--meridian-chart-3)' },
  { label: 'Pro', value: 38, color: 'var(--meridian-chart-2)' },
  { label: 'Enterprise', value: 41, color: 'var(--color-action-primary)' },
];

interface EventRow {
  id: number;
  user: string;
  event: string;
  time: string;
  type: 'signup' | 'upgrade' | 'cancel' | 'export' | 'invite';
}

const recentEvents: EventRow[] = [
  { id: 1, user: 'Priya Singh', event: 'Upgraded to Enterprise', time: '2m ago', type: 'upgrade' },
  { id: 2, user: 'Marcus Liu', event: 'Invited 3 team members', time: '11m ago', type: 'invite' },
  { id: 3, user: 'Yuki Tanaka', event: 'Exported usage report', time: '24m ago', type: 'export' },
  { id: 4, user: 'Sara Cole', event: 'New signup — Pro trial', time: '38m ago', type: 'signup' },
  { id: 5, user: 'Alex Morrow', event: 'Cancelled subscription', time: '1h ago', type: 'cancel' },
  { id: 6, user: 'Dana Park', event: 'Upgraded to Pro', time: '2h ago', type: 'upgrade' },
  { id: 7, user: 'Leo Vargas', event: 'New signup — Starter', time: '3h ago', type: 'signup' },
  { id: 8, user: 'Nina Patel', event: 'Invited 1 team member', time: '4h ago', type: 'invite' },
  { id: 9, user: 'Tom Bradley', event: 'Exported billing data', time: '5h ago', type: 'export' },
  { id: 10, user: 'Aiko Sato', event: 'Upgraded to Enterprise', time: '6h ago', type: 'upgrade' },
];

interface PageRow {
  path: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: string;
  avgTime: string;
}

const topPages: PageRow[] = [
  { path: '/dashboard', views: 18240, uniqueVisitors: 9120, bounceRate: '18%', avgTime: '4m 12s' },
  {
    path: '/settings/billing',
    views: 7840,
    uniqueVisitors: 4920,
    bounceRate: '32%',
    avgTime: '2m 45s',
  },
  { path: '/analytics', views: 6210, uniqueVisitors: 3820, bounceRate: '24%', avgTime: '5m 08s' },
  { path: '/team', views: 4380, uniqueVisitors: 2760, bounceRate: '41%', avgTime: '1m 58s' },
  {
    path: '/integrations',
    views: 3910,
    uniqueVisitors: 2380,
    bounceRate: '38%',
    avgTime: '2m 22s',
  },
  { path: '/onboarding', views: 2840, uniqueVisitors: 2840, bounceRate: '12%', avgTime: '6m 33s' },
];

const NAV_ITEMS = [
  { label: 'Overview', icon: '◼' },
  { label: 'Analytics', icon: '◷' },
  { label: 'Users', icon: '◉' },
  { label: 'Revenue', icon: '◈' },
  { label: 'Settings', icon: '◧' },
];

// ─── Chart components ──────────────────────────────────────────────────────────

function LineChart({
  data,
  color = 'var(--color-action-primary)',
}: { data: number[]; color?: string }): React.JSX.Element {
  const w = 100;
  const h = 100;
  const pad = { top: 8, right: 4, bottom: 20, left: 36 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data
    .map((v, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw;
      const y = pad.top + ch - ((v - min) / range) * ch;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const firstPt = data[0];
  const lastPt = data[data.length - 1];
  const firstX = pad.left;
  const lastX = pad.left + cw;
  const baseY = pad.top + ch;
  const firstY = pad.top + ch - ((firstPt - min) / range) * ch;
  const lastY = pad.top + ch - ((lastPt - min) / range) * ch;
  const areaPoints = `${firstX},${baseY} ${firstX},${firstY.toFixed(2)} ${pts} ${lastX},${lastY.toFixed(2)} ${lastX},${baseY}`;

  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => ({
    v: min + ((max - min) / ySteps) * i,
    y: pad.top + ch - (i / ySteps) * ch,
  }));

  const xCount = Math.min(data.length, 7);
  const xLabels = Array.from({ length: xCount }, (_, i) => {
    const idx = Math.round((i / (xCount - 1)) * (data.length - 1));
    return { idx, x: pad.left + (idx / (data.length - 1)) * cw };
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Activity line chart"
      style={{ width: '100%', height: '200px' }}
    >
      {/* Grid lines */}
      {yLabels.map(({ y }, i) => (
        <line
          key={i}
          x1={pad.left}
          x2={pad.left + cw}
          y1={y}
          y2={y}
          stroke="var(--color-border-subtle)"
          strokeWidth="0.5"
        />
      ))}
      {/* Area */}
      <polygon points={areaPoints} fill={color} opacity="0.08" />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Y labels */}
      {yLabels.map(({ v, y }, i) => (
        <text
          key={i}
          x={pad.left - 2}
          y={y + 1}
          textAnchor="end"
          fontSize="4"
          fill="var(--color-fg-muted)"
        >
          {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
        </text>
      ))}
      {/* X labels */}
      {xLabels.map(({ idx, x }) => (
        <text
          key={idx}
          x={x}
          y={h - 2}
          textAnchor="middle"
          fontSize="4"
          fill="var(--color-fg-muted)"
        >
          {data.length <= 7 ? `D${idx + 1}` : `${idx + 1}`}
        </text>
      ))}
    </svg>
  );
}

function BarChart({ data }: { data: typeof revenueByPlan }): React.JSX.Element {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="meridian-bar-chart" role="img" aria-label="Revenue by plan bar chart">
      {data.map((d) => (
        <div key={d.label} className="meridian-bar-row">
          <span className="meridian-bar-label">{d.label}</span>
          <div className="meridian-bar-track">
            <div
              className="meridian-bar-fill"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
          <span className="meridian-bar-value">${(d.value / 1000).toFixed(1)}k</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: typeof segmentData }): React.JSX.Element {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 40;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const strokeDasharray = `${(pct * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
    const strokeDashoffset = -offset * circumference;
    offset += pct;
    return { ...d, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="meridian-donut-wrapper">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="User segments donut chart"
        className="meridian-donut"
      >
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="14"
        />
        {slices.map((s) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={s.strokeDasharray}
            strokeDashoffset={s.strokeDashoffset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-fg-primary)"
        >
          {total}%
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="5" fill="var(--color-fg-secondary)">
          paid users
        </text>
      </svg>
      <div className="meridian-donut-legend">
        {data.map((d) => (
          <div key={d.label} className="meridian-legend-row">
            <span className="meridian-legend-dot" style={{ background: d.color }} />
            <span className="meridian-legend-label">{d.label}</span>
            <span className="meridian-legend-value">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Table columns ─────────────────────────────────────────────────────────────

const eventColumns: ColumnDef<EventRow>[] = [
  {
    key: 'user',
    header: 'User',
    render: (_v, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Avatar name={row.user} size="xs" />
        <span style={{ fontSize: '13px' }}>{row.user}</span>
      </span>
    ),
  },
  {
    key: 'event',
    header: 'Event',
    render: (_v, row) => <span style={{ fontSize: '13px' }}>{row.event}</span>,
  },
  {
    key: 'type',
    header: '',
    width: '100px',
    render: (_v, row) => (
      <Badge
        variant={
          row.type === 'upgrade'
            ? 'success'
            : row.type === 'cancel'
              ? 'error'
              : row.type === 'signup'
                ? 'info'
                : 'secondary'
        }
        size="sm"
      >
        {row.type}
      </Badge>
    ),
  },
  {
    key: 'time',
    header: '',
    width: '80px',
    render: (_v, row) => (
      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>{row.time}</span>
    ),
  },
];

const pageColumns: ColumnDef<PageRow>[] = [
  {
    key: 'path',
    header: 'Page',
    sortable: true,
    render: (_v, row) => (
      <code style={{ fontSize: '12px', color: 'var(--color-action-primary)' }}>{row.path}</code>
    ),
  },
  {
    key: 'views',
    header: 'Views',
    sortable: true,
    width: '90px',
    align: 'right' as const,
    render: (_v, row) => <span style={{ fontSize: '13px' }}>{row.views.toLocaleString()}</span>,
  },
  {
    key: 'uniqueVisitors',
    header: 'Uniques',
    sortable: true,
    width: '90px',
    align: 'right' as const,
    render: (_v, row) => (
      <span style={{ fontSize: '13px', color: 'var(--color-fg-secondary)' }}>
        {row.uniqueVisitors.toLocaleString()}
      </span>
    ),
  },
  {
    key: 'bounceRate',
    header: 'Bounce',
    width: '80px',
    align: 'right' as const,
    render: (_v, row) => (
      <span style={{ fontSize: '13px', color: 'var(--color-fg-secondary)' }}>{row.bounceRate}</span>
    ),
  },
  {
    key: 'avgTime',
    header: 'Avg time',
    width: '90px',
    align: 'right' as const,
    render: (_v, row) => (
      <span style={{ fontSize: '13px', color: 'var(--color-fg-secondary)' }}>{row.avgTime}</span>
    ),
  },
];

// ─── App ──────────────────────────────────────────────────────────────────────

type ActivityRange = '7d' | '30d' | '90d';

export function App(): React.JSX.Element {
  const [activeNav, setActiveNav] = useState('Overview');
  const [activityRange, setActivityRange] = useState<ActivityRange>('7d');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activityDataMap: Record<ActivityRange, number[]> = {
    '7d': activityData7d,
    '30d': activityData30d,
    '90d': activityData90d,
  };

  return (
    <div className="meridian">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <Navbar sticky>
        <NavbarBrand>
          <button
            type="button"
            className="meridian-hamburger"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="meridian-brand">Meridian</span>
          <Badge variant="secondary" size="sm">
            Analytics
          </Badge>
        </NavbarBrand>
        <NavbarContent>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`meridian-nav-link${activeNav === item.label ? ' meridian-nav-link--active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              {item.label}
            </button>
          ))}
        </NavbarContent>
        <NavbarActions>
          <Avatar name="Garrett Bear" size="sm" />
          <Button variant="ghost" size="sm">
            Log out
          </Button>
        </NavbarActions>
      </Navbar>

      <div className="meridian-layout">
        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <aside className={`meridian-sidebar${mobileMenuOpen ? ' meridian-sidebar--open' : ''}`}>
          <div className="meridian-sidebar-brand">
            <span className="meridian-brand">Meridian</span>
          </div>
          <nav className="meridian-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`meridian-sidebar-link${activeNav === item.label ? ' meridian-sidebar-link--active' : ''}`}
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileMenuOpen(false);
                }}
              >
                <span className="meridian-sidebar-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="meridian-sidebar-footer">
            <Avatar name="Garrett Bear" size="xs" />
            <div className="meridian-sidebar-user">
              <span className="meridian-sidebar-username">Garrett Bear</span>
              <span className="meridian-sidebar-role">Admin</span>
            </div>
          </div>
        </aside>

        {/* ── Main ───────────────────────────────────────────────────── */}
        <main className="meridian-main">
          <div className="meridian-page-header">
            <div>
              <h1 className="meridian-page-title">Overview</h1>
              <span className="meridian-page-subtitle">April 8, 2026 · Last 30 days</span>
            </div>
            <div className="meridian-page-actions">
              <Button variant="secondary" size="sm">
                Export
              </Button>
              <Button variant="primary" size="sm">
                + Invite
              </Button>
            </div>
          </div>

          {/* KPI row */}
          <div className="meridian-kpi-grid">
            <KPICard
              value="2,340"
              label="Active Users"
              trend={{ value: 12.4, direction: 'up' }}
              data={kpiSparkline7d}
              period="vs last week"
            />
            <KPICard
              value="$46,100"
              label="MRR"
              trend={{ value: 8.2, direction: 'up' }}
              data={kpiSparklineRev}
              period="vs last month"
            />
            <KPICard
              value="9,840"
              label="Sessions"
              trend={{ value: 5.8, direction: 'up' }}
              data={kpiSparklineSessions}
              period="vs last week"
            />
            <KPICard
              value="1.8%"
              label="Churn Rate"
              trend={{ value: 0.6, direction: 'down' }}
              data={kpiSparklineChurn}
              sparklineColor="var(--color-status-success-fg)"
              period="vs last month"
            />
          </div>

          {/* Charts row */}
          <div className="meridian-charts-row">
            {/* Activity */}
            <Card className="meridian-chart-card meridian-chart-card--wide">
              <CardBody>
                <div className="meridian-chart-header">
                  <h2 className="meridian-section-title">User Activity</h2>
                  <div className="meridian-range-tabs">
                    {(['7d', '30d', '90d'] as ActivityRange[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`meridian-range-btn${activityRange === r ? ' meridian-range-btn--active' : ''}`}
                        onClick={() => setActivityRange(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <LineChart data={activityDataMap[activityRange]} />
              </CardBody>
            </Card>

            {/* Revenue by Plan */}
            <Card className="meridian-chart-card">
              <CardBody>
                <h2 className="meridian-section-title" style={{ marginBottom: '20px' }}>
                  Revenue by Plan
                </h2>
                <BarChart data={revenueByPlan} />
                <div className="meridian-chart-total">
                  <span className="meridian-chart-total-label">Total MRR</span>
                  <span className="meridian-chart-total-value">
                    ${(revenueByPlan.reduce((s, d) => s + d.value, 0) / 1000).toFixed(1)}k
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Events + Segments row */}
          <div className="meridian-charts-row">
            {/* Recent Events */}
            <Card className="meridian-chart-card meridian-chart-card--wide">
              <CardBody>
                <div className="meridian-chart-header">
                  <h2 className="meridian-section-title">Recent Events</h2>
                  <Badge variant="secondary" size="sm">
                    {recentEvents.length}
                  </Badge>
                </div>
                <DataTable data={recentEvents} columns={eventColumns} hoverable />
              </CardBody>
            </Card>

            {/* User Segments */}
            <Card className="meridian-chart-card">
              <CardBody>
                <h2 className="meridian-section-title" style={{ marginBottom: '20px' }}>
                  User Segments
                </h2>
                <DonutChart data={segmentData} />
              </CardBody>
            </Card>
          </div>

          {/* Server health */}
          <Card style={{ marginBottom: '24px' }}>
            <CardBody>
              <h2 className="meridian-section-title" style={{ marginBottom: '16px' }}>
                Infrastructure Health
              </h2>
              <div className="meridian-health-grid">
                {[
                  { label: 'API Uptime', value: 99.98, variant: 'striped' as const },
                  { label: 'CPU Load', value: 34, variant: 'striped' as const },
                  { label: 'Memory', value: 61, variant: 'default' as const },
                  { label: 'Disk', value: 48, variant: 'striped' as const },
                ].map((m) => (
                  <div key={m.label} className="meridian-health-item">
                    <div className="meridian-health-label">
                      <span>{m.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
                        {m.value}%
                      </span>
                    </div>
                    <ProgressBar value={m.value} variant={m.variant} size="sm" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardBody>
              <div className="meridian-chart-header" style={{ marginBottom: '16px' }}>
                <h2 className="meridian-section-title">Top Pages</h2>
                <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
                  last 30 days
                </span>
              </div>
              <DataTable data={topPages} columns={pageColumns} sortable hoverable />
            </CardBody>
          </Card>
        </main>
      </div>

      <ThemeSwitcher defaultTheme="dark" />
    </div>
  );
}

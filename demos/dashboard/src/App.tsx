import {
  Badge,
  Button,
  Card,
  DataTable,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  ProgressBar,
  StatCard,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { useState } from 'react';
import './App.css';

// ─── Sample data ──────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const users: User[] = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'active' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Designer', status: 'active' },
  { id: 4, name: 'Dan Lee', email: 'dan@example.com', role: 'Developer', status: 'inactive' },
  { id: 5, name: 'Eve Wilson', email: 'eve@example.com', role: 'Marketing', status: 'active' },
  { id: 6, name: 'Frank Moore', email: 'frank@example.com', role: 'Developer', status: 'active' },
  { id: 7, name: 'Grace Taylor', email: 'grace@example.com', role: 'Admin', status: 'active' },
  { id: 8, name: 'Hank Brown', email: 'hank@example.com', role: 'Designer', status: 'inactive' },
];

const columns: ColumnDef<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (_value, row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>{row.status}</Badge>
    ),
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard' },
  { label: 'Analytics' },
  { label: 'Users' },
  { label: 'Settings' },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export function App(): React.JSX.Element {
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div className="dashboard">
      <Navbar>
        <NavbarBrand>
          <span className="dashboard__logo">Arcana</span>
          <Badge variant="secondary" size="sm">
            Dashboard
          </Badge>
        </NavbarBrand>
        <NavbarContent>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`dashboard__nav-link${activeNav === item.label ? ' dashboard__nav-link--active' : ''}`}
              onClick={() => setActiveNav(item.label)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </NavbarContent>
        <NavbarActions>
          <Button variant="ghost" size="sm">
            Log Out
          </Button>
        </NavbarActions>
      </Navbar>

      <div className="dashboard__layout">
        <aside className="dashboard__sidebar">
          <nav>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`dashboard__sidebar-link${activeNav === item.label ? ' dashboard__sidebar-link--active' : ''}`}
                onClick={() => setActiveNav(item.label)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard__main">
          <h1 className="dashboard__title">Dashboard</h1>

          <div className="dashboard__stats">
            <StatCard
              label="Total Users"
              value="1,284"
              trend={{ direction: 'up', value: 12.5 }}
              comparison="vs last month"
            />
            <StatCard
              label="Revenue"
              value="$48,290"
              prefix="$"
              trend={{ direction: 'up', value: 8.2 }}
              comparison="vs last month"
            />
            <StatCard
              label="Active Sessions"
              value="342"
              trend={{ direction: 'down', value: 3.1 }}
              comparison="vs last week"
            />
            <StatCard
              label="Conversion Rate"
              value="3.6%"
              suffix="%"
              trend={{ direction: 'up', value: 0.4 }}
              comparison="vs last month"
            />
          </div>

          <Tabs defaultValue="users">
            <TabList>
              <Tab value="users">Users</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="metrics">Metrics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="users">
                <Card>
                  <DataTable
                    data={users}
                    columns={columns}
                    sortable
                    filterable
                    pagination={{ pageSize: 5 }}
                  />
                </Card>
              </TabPanel>
              <TabPanel value="activity">
                <Card>
                  <div className="dashboard__placeholder">
                    <h3>Recent Activity</h3>
                    <p>Activity feed coming soon.</p>
                  </div>
                </Card>
              </TabPanel>
              <TabPanel value="metrics">
                <Card>
                  <div className="dashboard__metrics">
                    <div>
                      <h4>Server Uptime</h4>
                      <ProgressBar value={99.9} showValue color="success" />
                    </div>
                    <div>
                      <h4>CPU Usage</h4>
                      <ProgressBar value={67} showValue color="warning" />
                    </div>
                    <div>
                      <h4>Memory Usage</h4>
                      <ProgressBar value={42} showValue />
                    </div>
                    <div>
                      <h4>Disk Usage</h4>
                      <ProgressBar value={81} showValue color="error" />
                    </div>
                  </div>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </main>
      </div>

      <ThemeSwitcher defaultTheme="light" />
    </div>
  );
}

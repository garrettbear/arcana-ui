import {
  Avatar,
  Divider,
  KeyboardShortcut,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from '@arcana-ui/core';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Overview', path: '/', icon: '◎' },
  { label: 'Components', path: '/components', icon: '▦' },
  { label: 'Tokens', path: '/tokens', icon: '◈' },
  { label: 'Performance', path: '/performance', icon: '◷' },
  { label: 'Accessibility', path: '/accessibility', icon: '⊙' },
  { label: 'Builds', path: '/builds', icon: '⚙' },
];

export function ControlSidebar(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="control-sidebar-desktop">
      <Sidebar>
        <SidebarHeader>
          <div className="control-sidebar-logo">CONTROL</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection label="Navigation">
            {NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.path}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                icon={<span>{item.icon}</span>}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
          <Divider spacing="sm" />
          <SidebarSection>
            <div
              style={{
                padding: '0 var(--spacing-3, 12px)',
                fontSize: 'var(--font-size-xs, 0.75rem)',
                color: 'var(--color-fg-secondary)',
              }}
            >
              <KeyboardShortcut keys={['⌘', 'K']} /> Command palette
            </div>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <Divider spacing="sm" />
          <div className="control-sidebar-user">
            <Avatar name="Sage" size="sm" />
            <div className="control-sidebar-user__info">
              <span className="control-sidebar-user__name">Sage</span>
              <span className="control-sidebar-user__role">Agent</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

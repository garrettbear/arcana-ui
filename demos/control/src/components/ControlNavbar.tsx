import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Overview', path: '/', icon: '◎' },
  { label: 'Components', path: '/components', icon: '▦' },
  { label: 'Tokens', path: '/tokens', icon: '◈' },
  { label: 'Builds', path: '/builds', icon: '⚙' },
];

export function ControlMobileNav(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="control-mobile-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`control-mobile-nav__item${location.pathname === item.path ? ' control-mobile-nav__item--active' : ''}`}
          onClick={() => navigate(item.path)}
          aria-current={location.pathname === item.path ? 'page' : undefined}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

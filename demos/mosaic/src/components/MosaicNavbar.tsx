import {
  Avatar,
  Button,
  Input,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
} from '@arcana-ui/core';
import { Link, useNavigate } from 'react-router-dom';

function MosaicLogo(): React.JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="var(--color-action-primary)" />
      <rect
        x="13"
        y="2"
        width="9"
        height="9"
        rx="2"
        fill="var(--color-action-primary)"
        opacity="0.6"
      />
      <rect
        x="2"
        y="13"
        width="9"
        height="9"
        rx="2"
        fill="var(--color-action-primary)"
        opacity="0.6"
      />
      <rect
        x="13"
        y="13"
        width="9"
        height="9"
        rx="2"
        fill="var(--color-action-primary)"
        opacity="0.3"
      />
    </svg>
  );
}

export function MosaicNavbar(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Navbar>
      <NavbarBrand>
        <Link to="/" className="mosaic-nav-brand" aria-label="Mosaic home">
          <MosaicLogo />
          <span className="mosaic-nav-brand__text">Mosaic</span>
        </Link>
      </NavbarBrand>
      <NavbarContent>
        <div className="mosaic-nav-search">
          <Input placeholder="Search collections, people, tags..." size="md" />
        </div>
      </NavbarContent>
      <NavbarActions>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/collections')}
          aria-label="Collections"
        >
          Collections
        </Button>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          Notifications
        </Button>
        <Avatar size="sm" name="Alex M." />
      </NavbarActions>
    </Navbar>
  );
}

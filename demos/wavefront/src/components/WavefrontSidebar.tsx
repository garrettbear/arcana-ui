import { Avatar, Badge, Button, Input } from '@arcana-ui/core';
import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { collections } from '../data/collections';

function WaveformIcon(): React.JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="3" height="8" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="7" y="4" width="3" height="16" rx="1" fill="currentColor" />
      <rect x="12" y="6" width="3" height="12" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="17" y="9" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

interface WavefrontSidebarProps {
  onSettingsClick: () => void;
}

export function WavefrontSidebar({ onSettingsClick }: WavefrontSidebarProps): React.JSX.Element {
  const { currentView, setView, setCollection } = usePlayer();
  const [search, setSearch] = useState('');

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <nav className="wavefront-sidebar" aria-label="Main navigation">
      <div className="wavefront-sidebar__logo">
        <span className="wavefront-gold">
          <WaveformIcon />
        </span>
        <span className="wavefront-sidebar__logo-text">WAVEFRONT</span>
      </div>

      <div className="wavefront-sidebar__search">
        <Input
          placeholder="Search..."
          size="sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search collections"
        />
      </div>

      <nav className="wavefront-sidebar__nav">
        <div className="wavefront-sidebar__section-label">Library</div>
        <button
          type="button"
          className={`wavefront-sidebar__nav-item ${currentView === 'library' ? 'wavefront-sidebar__nav-item--active' : ''}`}
          onClick={() => setView('library')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
          </svg>
          Collections
        </button>
        <button type="button" className="wavefront-sidebar__nav-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a1 1 0 011 1v6.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 017 9V2a1 1 0 011-1z" />
            <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" opacity="0.3" />
          </svg>
          Recently Played
        </button>
        <button type="button" className="wavefront-sidebar__nav-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
          </svg>
          Favorites
        </button>
      </nav>

      <nav className="wavefront-sidebar__nav">
        <div className="wavefront-sidebar__section-label">Collections</div>
        {filteredCollections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            className="wavefront-sidebar__collection"
            onClick={() => setCollection(collection)}
          >
            <img
              className="wavefront-sidebar__collection-thumb"
              src={collection.artworkUrl}
              alt={collection.name}
              loading="lazy"
            />
            <div>
              <div className="wavefront-sidebar__collection-name">{collection.name}</div>
              <div className="wavefront-sidebar__collection-count">
                {collection.tracks.length} tracks
              </div>
            </div>
          </button>
        ))}
      </nav>

      <div className="wavefront-sidebar__footer">
        <Avatar name="WF" size="sm" />
        <div>
          <div style={{ fontSize: 'var(--font-size-sm, 14px)', fontWeight: 500 }}>Your Library</div>
          <Badge variant="default" size="sm">
            Free
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Settings"
          style={{ marginLeft: 'auto' }}
          onClick={onSettingsClick}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M6.5.5a1.5 1.5 0 013 0v.3a1 1 0 00.6.9l.3-.2a1.5 1.5 0 012.1 2.1l-.2.3a1 1 0 00.1.7l.3.1h.3a1.5 1.5 0 010 3h-.3a1 1 0 00-.9.6l.2.3a1.5 1.5 0 01-2.1 2.1l-.3-.2a1 1 0 00-.7.1l-.1.3v.3a1.5 1.5 0 01-3 0v-.3a1 1 0 00-.6-.9l-.3.2a1.5 1.5 0 01-2.1-2.1l.2-.3a1 1 0 00-.1-.7L1.3 9.5H1a1.5 1.5 0 010-3h.3a1 1 0 00.9-.6l-.2-.3a1.5 1.5 0 012.1-2.1l.3.2a1 1 0 00.7-.1l.1-.3V.5z"
              opacity="0.3"
            />
          </svg>
        </Button>
      </div>
    </nav>
  );
}

import { Badge, Banner, Button, Divider, StatCard } from '@arcana-ui/core';
import { CollectionCard } from '../components/CollectionCard';
import { usePlayer } from '../context/PlayerContext';
import { collections, formatTotalDuration } from '../data/collections';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

export function Library(): React.JSX.Element {
  const { playTrack, setCollection } = usePlayer();

  const totalTracks = collections.reduce((acc, c) => acc + c.tracks.length, 0);
  const allTracks = collections.flatMap((c) => c.tracks);
  const totalDuration = formatTotalDuration(allTracks);
  const featured = collections[0];

  return (
    <div>
      <div className="wavefront-banner">
        <Banner variant="info">You&apos;re listening offline. Some features are limited.</Banner>
      </div>

      <h1 className="wavefront-library__greeting">{getGreeting()}</h1>

      <div className="wavefront-library__stats">
        <StatCard label="Collections" value={String(collections.length)} />
        <StatCard label="Tracks" value={String(totalTracks)} />
        <StatCard label="Total Time" value={totalDuration} />
      </div>

      {/* Featured Collection */}
      <div className="wavefront-library__featured">
        <img
          className="wavefront-library__featured-art"
          src={featured.artworkUrl}
          alt={featured.name}
        />
        <div className="wavefront-library__featured-info">
          <span className="wavefront-library__featured-label">Featured Collection</span>
          <h2 className="wavefront-library__featured-title">{featured.name}</h2>
          <p className="wavefront-library__featured-meta">
            {featured.tracks.length} tracks · {formatTotalDuration(featured.tracks)} ·{' '}
            <Badge size="sm" variant="default">
              {featured.type}
            </Badge>
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm, 12px)' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => playTrack(featured.tracks[0], featured)}
              aria-label={`Play ${featured.name}`}
            >
              Play
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollection(featured)}
              aria-label={`View ${featured.name}`}
            >
              View
            </Button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Continue Listening */}
      <h2
        className="wavefront-library__section-title"
        style={{ marginTop: 'var(--spacing-xl, 32px)' }}
      >
        Continue Listening
      </h2>
      <div className="wavefront-library__scroll-row">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      {/* Recently Added */}
      <h2 className="wavefront-library__section-title">Recently Added</h2>
      <div className="wavefront-library__grid">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}

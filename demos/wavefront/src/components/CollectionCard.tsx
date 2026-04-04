import { Button } from '@arcana-ui/core';
import { usePlayer } from '../context/PlayerContext';
import type { Collection } from '../data/collections';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps): React.JSX.Element {
  const { setCollection, playTrack } = usePlayer();

  return (
    <button
      type="button"
      className="wavefront-collection-card"
      onClick={() => setCollection(collection)}
      aria-label={`${collection.name} — ${collection.tracks.length} tracks`}
    >
      <img
        className="wavefront-collection-card__art"
        src={collection.artworkUrl}
        alt={collection.name}
        loading="lazy"
      />
      <div className="wavefront-collection-card__body">
        <div className="wavefront-collection-card__name">{collection.name}</div>
        <div className="wavefront-collection-card__meta">
          {collection.tracks.length} tracks · {collection.type}
        </div>
      </div>
      <div className="wavefront-collection-card__play-overlay">
        <Button
          variant="primary"
          size="sm"
          aria-label={`Play ${collection.name}`}
          onClick={(e) => {
            e.stopPropagation();
            playTrack(collection.tracks[0], collection);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4 2.5a.5.5 0 01.79-.407l8 5.5a.5.5 0 010 .814l-8 5.5A.5.5 0 014 13.5v-11z" />
          </svg>
        </Button>
      </div>
    </button>
  );
}

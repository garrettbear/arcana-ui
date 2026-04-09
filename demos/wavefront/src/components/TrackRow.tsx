import { Button } from '@arcana-ui/core';
import { usePlayer } from '../context/PlayerContext';
import type { Collection, Track } from '../data/collections';

interface TrackRowProps {
  track: Track;
  index: number;
  collection: Collection;
}

export function TrackRow({ track, index, collection }: TrackRowProps): React.JSX.Element {
  const { currentTrack, playTrack, favorites, toggleFavorite } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const isFavorite = favorites.has(track.id);

  return (
    <button
      type="button"
      className={`wavefront-track-row ${isActive ? 'wavefront-track-row--active' : ''}`}
      onClick={() => playTrack(track, collection)}
      aria-label={`Play ${track.title} by ${track.artist}`}
      aria-current={isActive ? 'true' : undefined}
    >
      <span className="wavefront-track-row__number">{index + 1}</span>
      <span className="wavefront-track-row__title">{track.title}</span>
      <span className="wavefront-track-row__artist">{track.artist}</span>
      <span className="wavefront-track-row__duration">{track.duration}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(track.id);
        }}
        aria-label={
          isFavorite ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`
        }
        aria-pressed={isFavorite}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
        </svg>
      </Button>
    </button>
  );
}

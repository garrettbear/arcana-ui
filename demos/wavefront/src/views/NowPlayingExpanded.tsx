import { Button, Card, CardBody, Divider, ProgressBar, RatingStars } from '@arcana-ui/core';
import { TrackRow } from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { getTrackArtwork } from '../data/collections';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlayingExpanded(): React.JSX.Element {
  const {
    currentTrack,
    currentCollection,
    isPlaying,
    playbackProgress,
    shuffle,
    repeat,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    setView,
  } = usePlayer();

  if (!currentTrack || !currentCollection) {
    return (
      <div className="wavefront-expanded">
        <p style={{ color: 'var(--color-fg-secondary)' }}>
          No track selected. Choose something from your library.
        </p>
        <Button variant="outline" onClick={() => setView('library')}>
          Go to Library
        </Button>
      </div>
    );
  }

  const elapsed = Math.floor((playbackProgress / 100) * currentTrack.durationSeconds);
  const currentIdx = currentCollection.tracks.findIndex((t) => t.id === currentTrack.id);
  const upNext = currentCollection.tracks.slice(currentIdx + 1);

  return (
    <div className="wavefront-expanded">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('library')}
        aria-label="Back to library"
        style={{ alignSelf: 'flex-start' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M11 2L5 8l6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </Button>

      <img
        className="wavefront-expanded__art"
        src={getTrackArtwork(currentTrack)}
        alt={`${currentTrack.title} artwork`}
      />

      <h1 className="wavefront-expanded__title">{currentTrack.title}</h1>
      <p className="wavefront-expanded__artist">{currentTrack.artist}</p>

      <RatingStars value={4} max={5} size="lg" />

      <div className="wavefront-expanded__progress">
        <ProgressBar value={playbackProgress} max={100} aria-label="Playback progress" />
      </div>
      <div className="wavefront-expanded__time-row">
        <span>{formatTime(elapsed)}</span>
        <span>{currentTrack.duration}</span>
      </div>

      <div className="wavefront-expanded__controls">
        <Button
          variant={shuffle ? 'primary' : 'ghost'}
          size="sm"
          onClick={toggleShuffle}
          aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          aria-pressed={shuffle}
        >
          Shuffle
        </Button>
        <Button variant="ghost" onClick={prevTrack} aria-label="Previous track">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M3 2a1 1 0 011 1v10a1 1 0 11-2 0V3a1 1 0 011-1zm9.555 3.168A1 1 0 0114 6v4a1 1 0 01-1.445.832l-5-3a1 1 0 010-1.664l5-3z" />
          </svg>
        </Button>
        <Button
          variant="primary"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{ width: 48, height: 48, borderRadius: '50%' }}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M5.5 3.5A1.5 1.5 0 017 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zm5 0A1.5 1.5 0 0112 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5a.5.5 0 01.79-.407l8 5.5a.5.5 0 010 .814l-8 5.5A.5.5 0 014 13.5v-11z" />
            </svg>
          )}
        </Button>
        <Button variant="ghost" onClick={nextTrack} aria-label="Next track">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13 2a1 1 0 011 1v10a1 1 0 11-2 0V3a1 1 0 011-1zM3.445 5.168A1 1 0 002 6v4a1 1 0 001.445.832l5-3a1 1 0 000-1.664l-5-3z" />
          </svg>
        </Button>
        <Button
          variant={repeat ? 'primary' : 'ghost'}
          size="sm"
          onClick={toggleRepeat}
          aria-label={repeat ? 'Disable repeat' : 'Enable repeat'}
          aria-pressed={repeat}
        >
          Repeat
        </Button>
      </div>

      <Divider />

      {/* Lyrics placeholder */}
      <Card style={{ width: '100%' }}>
        <CardBody>
          <p
            style={{
              fontStyle: 'italic',
              color: 'var(--color-fg-secondary)',
              textAlign: 'center',
              lineHeight: 2,
            }}
          >
            We don&apos;t need to worry now
            <br />
            Everything will work out fine
            <br />
            Just let the music play
            <br />
            And ease your troubled mind
          </p>
        </CardBody>
      </Card>

      {/* Up Next */}
      {upNext.length > 0 && (
        <div className="wavefront-expanded__queue">
          <h2 className="wavefront-expanded__queue-title">Up Next</h2>
          {upNext.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={currentIdx + 1 + idx}
              collection={currentCollection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

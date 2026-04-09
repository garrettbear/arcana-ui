import { Button, ProgressBar } from '@arcana-ui/core';
import { usePlayer } from '../context/PlayerContext';
import { getTrackArtwork } from '../data/collections';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlayingBar(): React.JSX.Element {
  const {
    currentTrack,
    isPlaying,
    playbackProgress,
    volume,
    shuffle,
    repeat,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setView,
  } = usePlayer();

  const elapsed = currentTrack
    ? Math.floor((playbackProgress / 100) * currentTrack.durationSeconds)
    : 0;
  const total = currentTrack?.durationSeconds ?? 0;

  return (
    <section className="wavefront-now-playing-bar" aria-label="Now playing">
      {/* Track Info */}
      <button
        type="button"
        className="wavefront-now-playing-bar__track"
        onClick={() => currentTrack && setView('expanded')}
        aria-label={
          currentTrack
            ? `Now playing: ${currentTrack.title} by ${currentTrack.artist}`
            : 'No track playing'
        }
      >
        {currentTrack ? (
          <>
            <img
              src={getTrackArtwork(currentTrack)}
              alt={`${currentTrack.title} artwork`}
              width={48}
              height={48}
              style={{ borderRadius: 'var(--radius-md, 4px)' }}
            />
            <div className="wavefront-now-playing-bar__track-info">
              <div className="wavefront-now-playing-bar__track-name">{currentTrack.title}</div>
              <div className="wavefront-now-playing-bar__track-artist">{currentTrack.artist}</div>
            </div>
          </>
        ) : (
          <div className="wavefront-now-playing-bar__track-info">
            <div
              className="wavefront-now-playing-bar__track-name"
              style={{ color: 'var(--color-fg-secondary)' }}
            >
              Nothing playing
            </div>
          </div>
        )}
      </button>

      {/* Controls */}
      <div className="wavefront-now-playing-bar__controls">
        <div className="wavefront-now-playing-bar__buttons">
          <Button
            variant={shuffle ? 'primary' : 'ghost'}
            size="sm"
            onClick={toggleShuffle}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            aria-pressed={shuffle}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356A2.25 2.25 0 0111.16 4.5h1.95l-1.018 1.018a.75.75 0 001.06 1.06l2.28-2.28a.75.75 0 000-1.06l-2.28-2.316z" />
              <path d="M11.16 11.5h1.95l-1.018-1.018a.75.75 0 111.06-1.06l2.28 2.28a.75.75 0 010 1.06l-2.28 2.28a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34L6.59 9.456l1.116-1.33 1.724 2.034A2.25 2.25 0 0011.16 11.5z" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={prevTrack} aria-label="Previous track">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M3 2a1 1 0 011 1v10a1 1 0 11-2 0V3a1 1 0 011-1zm9.555 3.168A1 1 0 0114 6v4a1 1 0 01-1.445.832l-5-3a1 1 0 010-1.664l5-3z" />
            </svg>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.5 3.5A1.5 1.5 0 017 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zm5 0A1.5 1.5 0 0112 5v6a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4 2.5a.5.5 0 01.79-.407l8 5.5a.5.5 0 010 .814l-8 5.5A.5.5 0 014 13.5v-11z" />
              </svg>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={nextTrack} aria-label="Next track">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
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
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M11 1a1 1 0 011 1v1h1a3 3 0 013 3v4a3 3 0 01-3 3H5.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 111.414 1.414L5.414 10H13a1 1 0 001-1V5a1 1 0 00-1-1h-1v1a1 1 0 11-2 0V2a1 1 0 011-1z" />
            </svg>
          </Button>
        </div>
        <div className="wavefront-now-playing-bar__progress-row">
          <span className="wavefront-now-playing-bar__time">{formatTime(elapsed)}</span>
          <ProgressBar
            value={playbackProgress}
            max={100}
            size="sm"
            aria-label="Playback progress"
          />
          <span className="wavefront-now-playing-bar__time">{formatTime(total)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="wavefront-now-playing-bar__right">
        <Button variant="ghost" size="sm" aria-label="Volume">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path
              d="M9.536.636a.75.75 0 01.316.95L7.01 7h1.74a.75.75 0 01.614 1.18l-4.25 6a.75.75 0 01-1.35-.68L6.605 8H4.75a.75.75 0 01-.596-1.21l4.75-6.5a.75.75 0 01.632-.354z"
              opacity="0.5"
            />
            {volume > 0 && (
              <path d="M8 3a.5.5 0 01.5.5v9a.5.5 0 01-1 0v-9A.5.5 0 018 3zm-2 2a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5A.5.5 0 016 5zm4 1a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3A.5.5 0 0110 6z" />
            )}
          </svg>
        </Button>
        <div className="wavefront-now-playing-bar__volume">
          <ProgressBar value={volume} max={100} size="sm" aria-label={`Volume: ${volume}%`} />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume control"
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100px',
            cursor: 'pointer',
          }}
        />
      </div>
    </section>
  );
}

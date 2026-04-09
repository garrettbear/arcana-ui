import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Collection, Track } from '../data/collections';

interface PlayerState {
  currentTrack: Track | null;
  currentCollection: Collection | null;
  isPlaying: boolean;
  playbackProgress: number;
  volume: number;
  favorites: Set<string>;
  shuffle: boolean;
  repeat: boolean;
  currentView: 'library' | 'collection' | 'expanded';
}

interface PlayerActions {
  playTrack: (track: Track, collection: Collection) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  toggleFavorite: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setView: (view: PlayerState['currentView']) => void;
  setCollection: (collection: Collection) => void;
}

type PlayerContextType = PlayerState & PlayerActions;

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentView, setCurrentView] = useState<PlayerState['currentView']>('library');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      intervalRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 100 / currentTrack.durationSeconds;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback((track: Track, collection: Collection) => {
    setCurrentTrack(track);
    setCurrentCollection(collection);
    setIsPlaying(true);
    setPlaybackProgress(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentCollection || !currentTrack) return;
    const idx = currentCollection.tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % currentCollection.tracks.length;
    setCurrentTrack(currentCollection.tracks[nextIdx]);
    setPlaybackProgress(0);
  }, [currentCollection, currentTrack]);

  const prevTrack = useCallback(() => {
    if (!currentCollection || !currentTrack) return;
    const idx = currentCollection.tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = idx === 0 ? currentCollection.tracks.length - 1 : idx - 1;
    setCurrentTrack(currentCollection.tracks[prevIdx]);
    setPlaybackProgress(0);
  }, [currentCollection, currentTrack]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((p) => !p), []);
  const toggleRepeat = useCallback(() => setRepeat((p) => !p), []);
  const setView = useCallback((view: PlayerState['currentView']) => setCurrentView(view), []);
  const setCollection = useCallback(
    (collection: Collection) => {
      setCurrentCollection(collection);
      setView('collection');
    },
    [setView],
  );

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentCollection,
        isPlaying,
        playbackProgress,
        volume,
        favorites,
        shuffle,
        repeat,
        currentView,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        toggleFavorite,
        toggleShuffle,
        toggleRepeat,
        setView,
        setCollection,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextType {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}

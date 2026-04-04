import { Button, KeyboardShortcut, Modal, ToastProvider, useToast } from '@arcana-ui/core';
import { useEffect, useRef, useState } from 'react';
import { NowPlayingBar } from './components/NowPlayingBar';
import { WavefrontSidebar } from './components/WavefrontSidebar';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { CollectionDetail } from './views/CollectionDetail';
import { Library } from './views/Library';
import { NowPlayingExpanded } from './views/NowPlayingExpanded';

function MainContent(): React.JSX.Element {
  const { currentView, togglePlay } = usePlayer();

  // Space bar = play/pause (global keyboard shortcut)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  return (
    <>
      {currentView === 'library' && <Library />}
      {currentView === 'collection' && <CollectionDetail />}
      {currentView === 'expanded' && <NowPlayingExpanded />}
    </>
  );
}

function FavoriteToastBridge(): React.JSX.Element | null {
  const { favorites } = usePlayer();
  const { toast } = useToast();
  const prevCountRef = useRef(favorites.size);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = favorites.size;
    if (favorites.size > prev) {
      toast({ title: 'Added to favorites', variant: 'success', duration: 2000 });
    } else if (favorites.size < prev && prev > 0) {
      toast({ title: 'Removed from favorites', variant: 'default', duration: 2000 });
    }
  }, [favorites.size, toast]);

  return null;
}

function SettingsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }): React.JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div
        style={{
          padding: 'var(--spacing-md, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md, 16px)',
        }}
      >
        <p style={{ color: 'var(--color-fg-secondary)' }}>
          Wavefront v0.1 — Music without the algorithm.
        </p>
        <div>
          <h3
            style={{
              fontSize: 'var(--font-size-sm, 14px)',
              fontWeight: 500,
              marginBottom: 'var(--spacing-xs, 8px)',
            }}
          >
            Keyboard Shortcuts
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm, 12px)' }}>
            <KeyboardShortcut keys={['Space']} /> Play / Pause
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

function AppInner(): React.JSX.Element {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <WavefrontSidebar onSettingsClick={() => setSettingsOpen(true)} />
      <main className="wavefront-main">
        <MainContent />
      </main>
      <NowPlayingBar />
      <FavoriteToastBridge />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <PlayerProvider>
        <div className="wavefront-layout">
          <AppInner />
        </div>
      </PlayerProvider>
    </ToastProvider>
  );
}

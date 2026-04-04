import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Divider,
  EmptyState,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@arcana-ui/core';
import { TrackRow } from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { formatTotalDuration } from '../data/collections';

export function CollectionDetail(): React.JSX.Element {
  const { currentCollection, playTrack, favorites, setView } = usePlayer();

  if (!currentCollection) {
    return (
      <EmptyState
        title="No collection selected"
        description="Choose a collection from the sidebar to get started."
      />
    );
  }

  const collection = currentCollection;
  const favTracks = collection.tracks.filter((t) => favorites.has(t.id));

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <button
            type="button"
            onClick={() => setView('library')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-fg-secondary)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            Library
          </button>
        </BreadcrumbItem>
        <BreadcrumbItem current>{collection.name}</BreadcrumbItem>
      </Breadcrumb>

      <div className="wavefront-detail__hero">
        <img className="wavefront-detail__art" src={collection.artworkUrl} alt={collection.name} />
        <div className="wavefront-detail__info">
          <span className="wavefront-detail__type">{collection.type}</span>
          <h1 className="wavefront-detail__name">{collection.name}</h1>
          <p className="wavefront-detail__meta">
            {collection.tracks.length} tracks · {formatTotalDuration(collection.tracks)}
          </p>
          <div className="wavefront-detail__actions">
            <Button
              variant="primary"
              onClick={() => playTrack(collection.tracks[0], collection)}
              aria-label="Play all tracks"
            >
              Play All
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const shuffled = [...collection.tracks].sort(() => Math.random() - 0.5);
                playTrack(shuffled[0], collection);
              }}
              aria-label="Shuffle play"
            >
              Shuffle
            </Button>
            <Badge variant="default" size="sm">
              {collection.type}
            </Badge>
          </div>
        </div>
      </div>

      <Divider />

      <Tabs defaultValue="tracks">
        <TabList>
          <Tab value="tracks">Tracks</Tab>
          <Tab value="about">About</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="tracks">
            <div style={{ marginTop: 'var(--spacing-md, 16px)' }}>
              {/* Track list header */}
              <div
                className="wavefront-track-row"
                style={{
                  fontWeight: 500,
                  fontSize: 'var(--font-size-xs, 12px)',
                  color: 'var(--color-fg-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'default',
                }}
              >
                <span>#</span>
                <span>Title</span>
                <span>Artist</span>
                <span style={{ textAlign: 'right' }}>Duration</span>
                <span />
              </div>
              <Divider />
              {collection.tracks.map((track, idx) => (
                <TrackRow key={track.id} track={track} index={idx} collection={collection} />
              ))}
            </div>

            {favTracks.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-xl, 32px)' }}>
                <h3 className="wavefront-library__section-title">Favorites in this collection</h3>
                {favTracks.map((track, idx) => (
                  <TrackRow key={track.id} track={track} index={idx} collection={collection} />
                ))}
              </div>
            )}
          </TabPanel>
          <TabPanel value="about">
            <Card style={{ marginTop: 'var(--spacing-md, 16px)' }}>
              <CardBody>
                <p style={{ lineHeight: 1.8, color: 'var(--color-fg-secondary)' }}>
                  {collection.description}
                </p>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

import {
  Avatar,
  Badge,
  Banner,
  Button,
  Divider,
  Image,
  LogoCloud,
  Modal,
  ScrollArea,
  Select,
  Skeleton,
  useToast,
} from '@arcana-ui/core';
import { useCallback, useState } from 'react';
import { ImageCard } from '../components/ImageCard';
import { MasonryGrid } from '../components/MasonryGrid';
import { collections } from '../data/collections';
import {
  type FeedItem,
  allTags,
  feedItems as initialFeedItems,
  suggestedCollections,
  suggestedPeople,
} from '../data/feed';

const collectionOptions = collections.map((c) => ({ value: c.id, label: c.name }));

const logoItems = [
  { src: 'https://placehold.co/100x32/9CA3AF/FAFAFA?text=Studio', alt: 'Studio' },
  { src: 'https://placehold.co/100x32/9CA3AF/FAFAFA?text=Atelier', alt: 'Atelier' },
  { src: 'https://placehold.co/100x32/9CA3AF/FAFAFA?text=Form%26', alt: 'Form&' },
  { src: 'https://placehold.co/100x32/9CA3AF/FAFAFA?text=Object', alt: 'Object' },
];

export function Discover(): React.JSX.Element {
  const [activeTag, setActiveTag] = useState('All');
  const [items, setItems] = useState(initialFeedItems);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [saveCollection, setSaveCollection] = useState('');
  const [loading] = useState(false);
  const { toast } = useToast();

  const filteredItems =
    activeTag === 'All' ? items : items.filter((item) => item.tags.includes(activeTag));

  const handleSave = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, saved: !item.saved } : item)),
      );
      const item = items.find((i) => i.id === id);
      if (item) {
        const col = collections.find((c) => c.id === item.collection);
        toast({
          title: item.saved ? 'Removed from collection' : `Saved to ${col?.name ?? 'collection'}`,
          duration: 2000,
        });
      }
    },
    [items, toast],
  );

  const handleItemClick = useCallback((item: FeedItem) => {
    setSelectedItem(item);
    setSaveCollection(item.collection);
  }, []);

  const handleModalSave = useCallback(() => {
    if (selectedItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, saved: true, collection: saveCollection } : item,
        ),
      );
      const col = collections.find((c) => c.id === saveCollection);
      toast({ title: `Saved to ${col?.name ?? 'collection'}`, duration: 2000 });
      setSelectedItem(null);
    }
  }, [selectedItem, saveCollection, toast]);

  const relatedItems = selectedItem
    ? items
        .filter(
          (i) => i.id !== selectedItem.id && i.tags.some((t) => selectedItem.tags.includes(t)),
        )
        .slice(0, 4)
    : [];

  return (
    <>
      <div className="mosaic-banner-wrap">
        <Banner variant="info" dismissible>
          New: You can now share collections publicly.
        </Banner>
      </div>

      <div className="mosaic-main mosaic-main--with-sidebar">
        <div>
          {/* Filter pills */}
          <div className="mosaic-filters" role="tablist" aria-label="Filter by tag">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={activeTag === tag}
                className={`mosaic-filter-pill${activeTag === tag ? ' mosaic-filter-pill--active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          {loading ? (
            <MasonryGrid>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no unique id
                  key={i}
                  width="100%"
                  height={i % 2 === 0 ? '300px' : '200px'}
                  style={{
                    marginBottom: 'var(--spacing-md, 16px)',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
              ))}
            </MasonryGrid>
          ) : (
            <MasonryGrid>
              {filteredItems.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  onSave={handleSave}
                  onClick={handleItemClick}
                />
              ))}
            </MasonryGrid>
          )}
        </div>

        {/* Sidebar */}
        <aside className="mosaic-sidebar">
          <div className="mosaic-sidebar__section">
            <h3 className="mosaic-sidebar__title">Suggested collections</h3>
            {suggestedCollections.map((sc) => (
              <div key={sc.id} className="mosaic-sidebar-card">
                <Image
                  src={sc.imageUrl}
                  alt={sc.name}
                  className="mosaic-sidebar-card__image"
                  width={56}
                  height={56}
                />
                <div className="mosaic-sidebar-card__info">
                  <div className="mosaic-sidebar-card__name">{sc.name}</div>
                  <div className="mosaic-sidebar-card__meta">
                    {sc.curator} · {sc.itemCount} items
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          <div className="mosaic-sidebar__section">
            <h3 className="mosaic-sidebar__title">People to follow</h3>
            {suggestedPeople.map((person) => (
              <div key={person.name} className="mosaic-person">
                <Avatar size="sm" name={person.name} />
                <div className="mosaic-person__info">
                  <div className="mosaic-person__name">{person.name}</div>
                  <div className="mosaic-person__followers">
                    {person.followers.toLocaleString()} followers
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>

          <Divider />

          <div className="mosaic-sidebar__section">
            <h3 className="mosaic-sidebar__title">Trusted by teams at</h3>
            <LogoCloud logos={logoItems} />
          </div>
        </aside>
      </div>

      {/* Item detail modal */}
      <Modal
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title ?? ''}
        size="lg"
      >
        {selectedItem && (
          <div className="mosaic-item-detail">
            <div className="mosaic-item-detail__image">
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                width={selectedItem.width}
                height={selectedItem.height}
              />
            </div>
            <div className="mosaic-item-detail__info">
              <h2 className="mosaic-item-detail__title">{selectedItem.title}</h2>
              <div className="mosaic-item-detail__author">
                <Avatar size="sm" name={selectedItem.author.name} />
                <span>{selectedItem.author.name}</span>
              </div>
              <div className="mosaic-item-detail__tags">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div>
                <Select
                  value={saveCollection}
                  onChange={(val) => setSaveCollection(val as string)}
                  options={collectionOptions}
                />
              </div>
              <div className="mosaic-item-detail__actions">
                <Button variant="primary" onClick={handleModalSave}>
                  Save to Collection
                </Button>
                <Button variant="ghost">Share</Button>
              </div>
              {relatedItems.length > 0 && (
                <>
                  <p className="mosaic-item-detail__related-title">Related</p>
                  <ScrollArea orientation="horizontal">
                    <div className="mosaic-item-detail__related">
                      {relatedItems.map((ri) => (
                        <Image
                          key={ri.id}
                          src={ri.imageUrl}
                          alt={ri.title}
                          width={80}
                          height={80}
                          onClick={() => {
                            setSelectedItem(ri);
                            setSaveCollection(ri.collection);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedItem(ri);
                              setSaveCollection(ri.collection);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

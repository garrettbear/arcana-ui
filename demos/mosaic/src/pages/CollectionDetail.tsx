import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  EmptyState,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
} from '@arcana-ui/core';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ImageCard } from '../components/ImageCard';
import { MasonryGrid } from '../components/MasonryGrid';
import { collections } from '../data/collections';
import { type FeedItem, feedItems as allFeedItems } from '../data/feed';

export function CollectionDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const collection = collections.find((c) => c.id === id);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const { toast } = useToast();

  const collectionItems = allFeedItems.filter((item) => item.collection === id);
  const [items, setItems] = useState(collectionItems);

  const handleSave = useCallback(
    (itemId: string) => {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, saved: !item.saved } : item)),
      );
      toast({ title: 'Updated', duration: 1500 });
    },
    [toast],
  );

  const handleItemClick = useCallback((item: FeedItem) => {
    setSelectedItem(item);
  }, []);

  // Suppress unused variable warning — selectedItem is used for future modal integration
  void selectedItem;

  if (!collection) {
    return (
      <div className="mosaic-main">
        <EmptyState
          title="Collection not found"
          description="This collection doesn't exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="mosaic-main">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/collections">Collections</Link>
        </BreadcrumbItem>
        <BreadcrumbItem current>{collection.name}</BreadcrumbItem>
      </Breadcrumb>

      {/* Hero */}
      <div className="mosaic-collection-hero">
        <Image
          src={`https://placehold.co/800x300/${collection.coverBg.replace('#', '')}/${collection.coverText.replace('#', '')}?text=${encodeURIComponent(collection.name)}`}
          alt={collection.name}
          className="mosaic-collection-hero__image"
          width={800}
          height={300}
        />
        <div className="mosaic-collection-hero__overlay">
          <h1 className="mosaic-collection-hero__title">{collection.name}</h1>
          <div className="mosaic-collection-hero__meta">
            <Badge variant="default">{collection.itemCount} items</Badge>
            <Badge variant="default">{collection.privacy}</Badge>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="items">
        <TabList>
          <Tab value="items">Items</Tab>
          <Tab value="about">About</Tab>
          <Tab value="collaborators">Collaborators</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="items">
            <div className="mosaic-tab-content">
              {items.length === 0 ? (
                <EmptyState
                  title="No items yet"
                  description="Start saving items to this collection from the Discover feed."
                />
              ) : (
                <MasonryGrid>
                  {items.map((item) => (
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
          </TabPanel>
          <TabPanel value="about">
            <div className="mosaic-tab-content mosaic-tab-content__description">
              <Textarea
                defaultValue={collection.description}
                rows={4}
                aria-label="Collection description"
              />
              <div
                className="mosaic-item-detail__tags"
                style={{ marginTop: 'var(--spacing-md, 16px)' }}
              >
                <Badge variant="default" size="sm">
                  Architecture
                </Badge>
                <Badge variant="default" size="sm">
                  Design
                </Badge>
                <Badge variant="default" size="sm">
                  Inspiration
                </Badge>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="collaborators">
            <div className="mosaic-tab-content">
              <div className="mosaic-collaborators">
                {collection.collaborators.map((collab) => (
                  <div key={collab.name} className="mosaic-collaborator">
                    <Avatar size="sm" name={collab.name} />
                    <div className="mosaic-collaborator__info">
                      <span className="mosaic-collaborator__name">{collab.name}</span>
                    </div>
                    <Badge variant={collab.role === 'Owner' ? 'info' : 'default'} size="sm">
                      {collab.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

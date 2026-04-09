import { Avatar, Badge, Button, Image } from '@arcana-ui/core';
import type { FeedItem } from '../data/feed';

interface ImageCardProps {
  item: FeedItem;
  onSave: (id: string) => void;
  onClick: (item: FeedItem) => void;
}

export function ImageCard({ item, onSave, onClick }: ImageCardProps): React.JSX.Element {
  return (
    <div className="mosaic-image-card">
      <button
        type="button"
        className="mosaic-image-card__trigger"
        onClick={() => onClick(item)}
        aria-label={`View ${item.title}`}
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          className="mosaic-image-card__image"
          width={item.width}
          height={item.height}
        />
        <div className="mosaic-image-card__overlay">
          <span className="mosaic-image-card__title">{item.title}</span>
          <div className="mosaic-image-card__footer">
            <div className="mosaic-image-card__author">
              <Avatar size="sm" name={item.author.name} />
              <span className="mosaic-image-card__author-name">{item.author.name}</span>
            </div>
          </div>
        </div>
      </button>
      <div className="mosaic-image-card__actions">
        <Button
          size="sm"
          variant={item.saved ? 'primary' : 'ghost'}
          onClick={(e) => {
            e.stopPropagation();
            onSave(item.id);
          }}
          aria-label={item.saved ? 'Unsave item' : 'Save item'}
        >
          {item.saved ? '♥' : '♡'}
        </Button>
      </div>
      {item.saved && (
        <div className="mosaic-image-card__saved-badge">
          <Badge variant="info" size="sm">
            Saved
          </Badge>
        </div>
      )}
    </div>
  );
}

import { Badge, Card, CardBody, Image } from '@arcana-ui/core';
import { Link } from 'react-router-dom';
import type { Collection } from '../data/collections';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps): React.JSX.Element {
  return (
    <Card className="mosaic-collection-card">
      <Link to={`/collections/${collection.id}`} className="mosaic-collection-card__cover">
        <Image
          src={collection.coverImageUrl}
          alt={collection.name}
          className="mosaic-collection-card__image"
          width={600}
          height={400}
        />
        <div className="mosaic-collection-card__hover-actions">
          <span className="mosaic-collection-card__view-label">View</span>
        </div>
      </Link>
      <CardBody>
        <div className="mosaic-collection-card__info">
          <h3 className="mosaic-collection-card__name">{collection.name}</h3>
          <div className="mosaic-collection-card__meta">
            <Badge variant="default" size="sm">
              {collection.itemCount} items
            </Badge>
            <span className="mosaic-collection-card__updated">{collection.lastUpdated}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

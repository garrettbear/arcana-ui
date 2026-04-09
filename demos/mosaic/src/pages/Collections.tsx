import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  StatCard,
  Textarea,
  useToast,
} from '@arcana-ui/core';
import { useState } from 'react';
import { CollectionCard } from '../components/CollectionCard';
import { collections, totalItems } from '../data/collections';

const privacyOptions = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Shared', label: 'Shared' },
];

export function Collections(): React.JSX.Element {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('Public');
  const [addCover, setAddCover] = useState(false);
  const { toast } = useToast();

  const handleCreate = (e: React.FormEvent): void => {
    e.preventDefault();
    toast({ title: `Collection "${name}" created`, variant: 'success', duration: 2000 });
    setCreateOpen(false);
    setName('');
    setDescription('');
    setPrivacy('Public');
    setAddCover(false);
  };

  return (
    <div className="mosaic-main">
      {/* Stats */}
      <div className="mosaic-stats">
        <StatCard label="Total Items" value={totalItems.toString()} />
        <StatCard label="Collections" value={collections.length.toString()} />
        <StatCard label="Followers" value="12" />
      </div>

      {/* Header */}
      <div className="mosaic-collections-header">
        <div>
          <h1 className="mosaic-heading">Your Collections</h1>
          <p className="mosaic-collections-header__subtitle">
            {collections.length} collections · {totalItems} items
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          Create Collection
        </Button>
      </div>

      {/* Grid */}
      <div className="mosaic-collections-grid">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Collection">
        <form onSubmit={handleCreate} className="mosaic-create-form">
          <Input
            placeholder="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Collection name"
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            aria-label="Collection description"
          />
          <Select
            value={privacy}
            onChange={(val) => setPrivacy(val as string)}
            options={privacyOptions}
          />
          <Checkbox
            checked={addCover}
            onChange={() => setAddCover(!addCover)}
            label="Add a cover image"
          />
          <Button type="submit" variant="primary">
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
}

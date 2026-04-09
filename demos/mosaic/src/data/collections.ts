export interface Collection {
  id: string;
  name: string;
  itemCount: number;
  coverBg: string;
  coverText: string;
  coverImageUrl: string;
  description: string;
  lastUpdated: string;
  privacy: 'Public' | 'Private' | 'Shared';
  collaborators: Collaborator[];
}

export interface Collaborator {
  name: string;
  initials: string;
  role: 'Owner' | 'Editor';
}

export const collections: Collection[] = [
  {
    id: 'architecture-space',
    name: 'Architecture & Space',
    itemCount: 48,
    coverBg: '#2D5BE3',
    coverText: '#FFFFFF',
    coverImageUrl: 'https://placehold.co/600x400/2D5BE3/FFFFFF?text=Architecture',
    description:
      'Structures, facades, and spatial compositions that shape how we move through the world. Brutalism to biomorphic, concrete to glass.',
    lastUpdated: '2 hours ago',
    privacy: 'Public',
    collaborators: [
      { name: 'Alex M.', initials: 'AM', role: 'Owner' },
      { name: 'Jordan K.', initials: 'JK', role: 'Editor' },
    ],
  },
  {
    id: 'type-print',
    name: 'Type & Print',
    itemCount: 31,
    coverBg: '#18181B',
    coverText: '#FAFAFA',
    coverImageUrl: 'https://placehold.co/600x400/18181B/FAFAFA?text=Type+%26+Print',
    description: 'Letterforms, poster design, and the printed word. From Gutenberg to grotesk.',
    lastUpdated: '1 day ago',
    privacy: 'Public',
    collaborators: [{ name: 'Alex M.', initials: 'AM', role: 'Owner' }],
  },
  {
    id: 'color-studies',
    name: 'Color Studies',
    itemCount: 67,
    coverBg: '#F59E0B',
    coverText: '#1C1917',
    coverImageUrl: 'https://placehold.co/600x400/F59E0B/1C1917?text=Color+Studies',
    description:
      'Explorations in hue, saturation, and value. Pantone swatches, color field painting, gradient experiments.',
    lastUpdated: '3 days ago',
    privacy: 'Private',
    collaborators: [{ name: 'Alex M.', initials: 'AM', role: 'Owner' }],
  },
  {
    id: 'interior-moods',
    name: 'Interior Moods',
    itemCount: 22,
    coverBg: '#6B7280',
    coverText: '#F9FAFB',
    coverImageUrl: 'https://placehold.co/600x400/6B7280/F9FAFB?text=Interior+Moods',
    description:
      'Rooms, corners, light through windows. The way materials meet and spaces breathe.',
    lastUpdated: '1 week ago',
    privacy: 'Shared',
    collaborators: [
      { name: 'Alex M.', initials: 'AM', role: 'Owner' },
      { name: 'Sam T.', initials: 'ST', role: 'Editor' },
    ],
  },
  {
    id: 'product-design',
    name: 'Product Design',
    itemCount: 55,
    coverBg: '#475569',
    coverText: '#F8FAFC',
    coverImageUrl: 'https://placehold.co/600x400/475569/F8FAFC?text=Product+Design',
    description:
      'Objects designed with intention. Industrial design, furniture, tools, and the things we hold.',
    lastUpdated: '4 days ago',
    privacy: 'Public',
    collaborators: [{ name: 'Alex M.', initials: 'AM', role: 'Owner' }],
  },
];

export const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0);

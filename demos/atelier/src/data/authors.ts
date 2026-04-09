export interface Author {
  slug: string;
  name: string;
  location: string;
  bio: string;
  avatar?: string;
}

export const authors: Author[] = [
  {
    slug: 'elena-marchetti',
    name: 'Elena Marchetti',
    location: 'Rome',
    bio: 'Elena Marchetti is a contributing editor at Atelier and an architecture critic based in Rome. Her work has appeared in Domus, Wallpaper*, and The Architectural Review.',
  },
  {
    slug: 'james-holbrook',
    name: 'James Holbrook',
    location: 'Oslo',
    bio: 'James Holbrook covers residential architecture and landscape design across Scandinavia. He is the author of Nordic Light: Houses at the Edge of the World.',
  },
  {
    slug: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    location: 'Kyoto',
    bio: 'Yuki Tanaka writes on Japanese design philosophy and its influence on contemporary Western practice. She contributes regularly to Atelier, Casa Brutus, and PIN–UP.',
  },
  {
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    location: 'Los Angeles',
    bio: 'Sarah Chen is an architecture writer and critic based in Los Angeles. She teaches architectural history at SCI-Arc and has been a contributing editor at Atelier since 2023.',
  },
  {
    slug: 'olivier-beaumont',
    name: 'Olivier Beaumont',
    location: 'Paris',
    bio: 'Olivier Beaumont writes on materials, manufacturing, and craft. He trained as a cabinet-maker before turning to criticism and has contributed to Atelier for over a decade.',
  },
  {
    slug: 'kenji-watanabe',
    name: 'Kenji Watanabe',
    location: 'Tokyo',
    bio: 'Kenji Watanabe covers architecture and urbanism across East Asia. His writing focuses on the tension between density and domesticity in contemporary Japanese cities.',
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

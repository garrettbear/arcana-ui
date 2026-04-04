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
    location: 'Milan',
    bio: 'Contributing editor since 2018. Former critic at Domus.',
  },
  {
    slug: 'jonas-brandt',
    name: 'Jonas Brandt',
    location: 'Berlin',
    bio: 'Covers residential architecture and adaptive reuse.',
  },
  {
    slug: 'sophie-laurent',
    name: 'Sophie Laurent',
    location: 'Paris',
    bio: 'Writes on materials, manufacturing, and craft.',
  },
  {
    slug: 'marcus-webb',
    name: 'Marcus Webb',
    location: 'London',
    bio: 'Architecture critic, formerly of the FT Weekend.',
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

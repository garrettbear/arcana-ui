export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
}

export interface Collection {
  id: string;
  name: string;
  type: 'playlist' | 'station';
  description: string;
  artworkUrl: string;
  tracks: Track[];
}

function makeArtUrl(bg: string, fg: string, initials: string): string {
  return `https://placehold.co/400x400/${bg.replace('#', '')}/${fg.replace('#', '')}?text=${encodeURIComponent(initials)}`;
}

const lateNightTracks: Track[] = [
  {
    id: 'ln-1',
    title: 'After Hours',
    artist: 'Khruangbin',
    duration: '4:23',
    durationSeconds: 263,
  },
  { id: 'ln-2', title: 'Bloom', artist: 'Novo Amor', duration: '3:48', durationSeconds: 228 },
  {
    id: 'ln-3',
    title: 'Retrograde',
    artist: 'James Blake',
    duration: '4:01',
    durationSeconds: 241,
  },
  { id: 'ln-4', title: 'Holocene', artist: 'Bon Iver', duration: '5:37', durationSeconds: 337 },
  {
    id: 'ln-5',
    title: 'Motion Picture Soundtrack',
    artist: 'Radiohead',
    duration: '5:16',
    durationSeconds: 316,
  },
  {
    id: 'ln-6',
    title: 'To Build a Home',
    artist: 'The Cinematic Orchestra',
    duration: '7:20',
    durationSeconds: 440,
  },
  {
    id: 'ln-7',
    title: 'Cape Cod Kwassa Kwassa',
    artist: 'Vampire Weekend',
    duration: '3:33',
    durationSeconds: 213,
  },
  {
    id: 'ln-8',
    title: 'Banana Pancakes',
    artist: 'Jack Johnson',
    duration: '3:16',
    durationSeconds: 196,
  },
];

const pacificCoastTracks: Track[] = [
  { id: 'pc-1', title: 'Dreams', artist: 'Fleetwood Mac', duration: '4:14', durationSeconds: 254 },
  {
    id: 'pc-2',
    title: 'Go Your Own Way',
    artist: 'Fleetwood Mac',
    duration: '3:37',
    durationSeconds: 217,
  },
  {
    id: 'pc-3',
    title: 'Gold Dust Woman',
    artist: 'Fleetwood Mac',
    duration: '4:51',
    durationSeconds: 291,
  },
  {
    id: 'pc-4',
    title: 'The Chain',
    artist: 'Fleetwood Mac',
    duration: '4:29',
    durationSeconds: 269,
  },
  { id: 'pc-5', title: 'Sara', artist: 'Fleetwood Mac', duration: '3:25', durationSeconds: 205 },
  {
    id: 'pc-6',
    title: 'Rhiannon',
    artist: 'Fleetwood Mac',
    duration: '4:09',
    durationSeconds: 249,
  },
];

const deepFocusTracks: Track[] = [
  {
    id: 'df-1',
    title: 'Experience',
    artist: 'Ludovico Einaudi',
    duration: '5:14',
    durationSeconds: 314,
  },
  {
    id: 'df-2',
    title: 'Nuvole Bianche',
    artist: 'Ludovico Einaudi',
    duration: '5:54',
    durationSeconds: 354,
  },
  {
    id: 'df-3',
    title: 'Divenire',
    artist: 'Ludovico Einaudi',
    duration: '8:32',
    durationSeconds: 512,
  },
  {
    id: 'df-4',
    title: 'Spiegel im Spiegel',
    artist: 'Arvo Pärt',
    duration: '10:26',
    durationSeconds: 626,
  },
  {
    id: 'df-5',
    title: 'Gymnopédie No.1',
    artist: 'Erik Satie',
    duration: '3:04',
    durationSeconds: 184,
  },
  {
    id: 'df-6',
    title: 'Clair de lune',
    artist: 'Claude Debussy',
    duration: '4:56',
    durationSeconds: 296,
  },
];

export const collections: Collection[] = [
  {
    id: 'late-night-sessions',
    name: 'Late Night Sessions',
    type: 'playlist',
    description:
      'A carefully curated playlist for those hours when the city gets quiet and the music gets honest. Khruangbin grooves, Bon Iver harmonics, and Radiohead at its most tender.',
    artworkUrl: makeArtUrl('#1A1A2E', '#C9A84C', 'LN'),
    tracks: lateNightTracks,
  },
  {
    id: 'pacific-coast',
    name: 'Pacific Coast',
    type: 'station',
    description:
      'Fleetwood Mac from front to back — the definitive Rumours-era station. Stevie Nicks and Lindsey Buckingham at the height of their creative tension. Best played with the windows down.',
    artworkUrl: makeArtUrl('#1A1A1A', '#D4AF37', 'PC'),
    tracks: pacificCoastTracks,
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    type: 'playlist',
    description:
      'Piano, strings, and silence. Einaudi, Pärt, Satie, and Debussy — composers who understood that the space between notes matters as much as the notes themselves. For deep work.',
    artworkUrl: makeArtUrl('#0D0D1A', '#A0B0FF', 'DF'),
    tracks: deepFocusTracks,
  },
];

export function getTrackArtwork(track: Track): string {
  const artworkMap: Record<string, string> = {
    Khruangbin: makeArtUrl('#1A1A2E', '#C9A84C', 'K'),
    'Novo Amor': makeArtUrl('#2D1B30', '#E8C5F0', 'NA'),
    'James Blake': makeArtUrl('#0D1F2D', '#4FC3F7', 'JB'),
    'Bon Iver': makeArtUrl('#1A2A1A', '#A8D5A2', 'BI'),
    Radiohead: makeArtUrl('#1A0D0D', '#FF6B6B', 'RH'),
    'The Cinematic Orchestra': makeArtUrl('#0D1A2A', '#7EB8F7', 'CO'),
    'Vampire Weekend': makeArtUrl('#2A1A0D', '#FFB347', 'VW'),
    'Jack Johnson': makeArtUrl('#2A1A0D', '#FFB347', 'JJ'),
    'Fleetwood Mac': makeArtUrl('#1A1A1A', '#D4AF37', 'FM'),
    'Ludovico Einaudi': makeArtUrl('#0D0D1A', '#A0B0FF', 'LE'),
    'Arvo Pärt': makeArtUrl('#1A1A14', '#F0ECC8', 'AP'),
    'Erik Satie': makeArtUrl('#0D1A14', '#78C5A0', 'ES'),
    'Claude Debussy': makeArtUrl('#0D1A14', '#78C5A0', 'CD'),
  };
  return artworkMap[track.artist] ?? makeArtUrl('#1A1A2E', '#C9A84C', '??');
}

export function formatTotalDuration(tracks: Track[]): string {
  const totalSeconds = tracks.reduce((acc, t) => acc + t.durationSeconds, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

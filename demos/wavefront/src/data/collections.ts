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

// ─── Track lists ──────────────────────────────────────────────────────────────

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

const sunsetDriveTracks: Track[] = [
  {
    id: 'sd-1',
    title: 'Let It Happen',
    artist: 'Tame Impala',
    duration: '7:47',
    durationSeconds: 467,
  },
  {
    id: 'sd-2',
    title: 'Feels Like We Only Go Backwards',
    artist: 'Tame Impala',
    duration: '3:13',
    durationSeconds: 193,
  },
  {
    id: 'sd-3',
    title: 'Multi-Love',
    artist: 'Unknown Mortal Orchestra',
    duration: '4:29',
    durationSeconds: 269,
  },
  {
    id: 'sd-4',
    title: 'Space Song',
    artist: 'Beach House',
    duration: '5:09',
    durationSeconds: 309,
  },
  { id: 'sd-5', title: 'Runnin', artist: 'Neon Trees', duration: '3:55', durationSeconds: 235 },
  {
    id: 'sd-6',
    title: 'Feel It All Around',
    artist: 'Washed Out',
    duration: '4:01',
    durationSeconds: 241,
  },
  { id: 'sd-7', title: 'Home', artist: 'Caribou', duration: '5:29', durationSeconds: 329 },
];

const neoSeoulTracks: Track[] = [
  { id: 'ns-1', title: 'Kong', artist: 'Bonobo', duration: '6:14', durationSeconds: 374 },
  { id: 'ns-2', title: 'Kiara', artist: 'Bonobo', duration: '4:54', durationSeconds: 294 },
  { id: 'ns-3', title: 'My Own', artist: 'Four Tet', duration: '7:22', durationSeconds: 442 },
  { id: 'ns-4', title: 'Octan', artist: 'Floating Points', duration: '8:03', durationSeconds: 483 },
  { id: 'ns-5', title: 'Wanderlust', artist: 'Bicep', duration: '5:44', durationSeconds: 344 },
  { id: 'ns-6', title: 'Glue', artist: 'Bicep', duration: '6:29', durationSeconds: 389 },
  { id: 'ns-7', title: 'Surrender', artist: 'Bonobo', duration: '5:55', durationSeconds: 355 },
];

// ─── Collections ──────────────────────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: 'late-night-sessions',
    name: 'Late Night Sessions',
    type: 'playlist',
    description:
      'A carefully curated playlist for those hours when the city gets quiet and the music gets honest. Khruangbin grooves, Bon Iver harmonics, and Radiohead at its most tender.',
    artworkUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=85',
    tracks: lateNightTracks,
  },
  {
    id: 'pacific-coast',
    name: 'Pacific Coast',
    type: 'station',
    description:
      'Fleetwood Mac from front to back — the definitive Rumours-era station. Stevie Nicks and Lindsey Buckingham at the height of their creative tension. Best played with the windows down.',
    artworkUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=85',
    tracks: pacificCoastTracks,
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    type: 'playlist',
    description:
      'Piano, strings, and silence. Einaudi, Pärt, Satie, and Debussy — composers who understood that the space between notes matters as much as the notes themselves. For deep work.',
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=85',
    tracks: deepFocusTracks,
  },
  {
    id: 'sunset-drive',
    name: 'Sunset Drive',
    type: 'station',
    description:
      'Tame Impala, Beach House, and Washed Out — the hazy, saturated end of the day. Best experienced on a highway with no destination and the sun at 15 degrees.',
    artworkUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=85',
    tracks: sunsetDriveTracks,
  },
  {
    id: 'neo-seoul',
    name: 'Neo Seoul',
    type: 'station',
    description:
      'Bonobo, Four Tet, Floating Points, Bicep — the music of cities that never sleep. Electronic textures, organic percussion, and bass that arrives late but stays long.',
    artworkUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=85',
    tracks: neoSeoulTracks,
  },
];

// ─── Artist artwork ───────────────────────────────────────────────────────────

export function getTrackArtwork(track: Track): string {
  const artworkMap: Record<string, string> = {
    Khruangbin: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=80&q=80',
    'Novo Amor': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&q=80',
    'James Blake': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&q=80',
    'Bon Iver': 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=80&q=80',
    Radiohead: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=80&q=80',
    'The Cinematic Orchestra':
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=80&q=80',
    'Vampire Weekend': 'https://images.unsplash.com/photo-1474650914696-cdb0a4b5b7a4?w=80&q=80',
    'Jack Johnson': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    'Fleetwood Mac': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80&q=80',
    'Ludovico Einaudi': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&q=80',
    'Arvo Pärt': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=80&q=80',
    'Erik Satie': 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=80&q=80',
    'Claude Debussy': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=80&q=80',
    'Tame Impala': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=80&q=80',
    'Unknown Mortal Orchestra':
      'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=80&q=80',
    'Beach House': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=80&q=80',
    'Neon Trees': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=80&q=80',
    'Washed Out': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=80',
    Caribou: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=80&q=80',
    Bonobo: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=80&q=80',
    'Four Tet': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&q=80',
    'Floating Points': 'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=80&q=80',
    Bicep: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=80&q=80',
  };
  return (
    artworkMap[track.artist] ??
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=80&q=80'
  );
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

import type { Track } from '@/types/music';

interface ItunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName: string;
  kind: string;
}

interface ItunesResponse {
  resultCount: number;
  results: ItunesResult[];
}

const ITUNES_BASE = 'https://itunes.apple.com/search';

function mapToTrack(r: ItunesResult): Track {
  return {
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName ?? '',
    previewUrl: r.previewUrl!,
    artworkUrl: r.artworkUrl100?.replace('100x100bb', '300x300bb') ?? '',
    genre: r.primaryGenreName,
  };
}

export async function fetchTracksByTerm(term: string, limit = 100): Promise<Track[]> {
  const params = new URLSearchParams({
    term,
    entity: 'song',
    limit: String(limit),
    country: 'us',
    media: 'music',
  });

  const res = await fetch(`${ITUNES_BASE}?${params}`);
  if (!res.ok) throw new Error(`iTunes API error: ${res.status}`);

  const data: ItunesResponse = await res.json();
  return data.results
    .filter(r => r.kind === 'song' && !!r.previewUrl)
    .map(mapToTrack);
}

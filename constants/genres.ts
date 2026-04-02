export interface Genre {
  id: string;
  label: string;
  emoji: string;
  searchTerm: string;
  color: string;
}

export const DAILY_GENRE: Genre = {
  id: 'daily',
  label: 'Reto del Día',
  emoji: '📅',
  searchTerm: 'top hits',
  color: '#1DB954',
};

export const GENRES: Genre[] = [
  { id: 'pop',        label: 'Pop',        emoji: '🎵', searchTerm: 'pop hits',               color: '#FF6B9D' },
  { id: 'rock',       label: 'Rock',       emoji: '🎸', searchTerm: 'rock classic hits',       color: '#FF4D4D' },
  { id: 'hiphop',     label: 'Hip-Hop',    emoji: '🎤', searchTerm: 'hip hop rap',             color: '#8B5CF6' },
  { id: 'electronic', label: 'Electronic', emoji: '🎹', searchTerm: 'electronic dance music',  color: '#06B6D4' },
  { id: 'rnb',        label: 'R&B',        emoji: '🎶', searchTerm: 'rnb soul',                color: '#F59E0B' },
  { id: 'latin',      label: 'Latin',      emoji: '🌶️', searchTerm: 'latin reggaeton pop',    color: '#EF4444' },
  { id: 'country',    label: 'Country',    emoji: '🤠', searchTerm: 'country hits',            color: '#84CC16' },
  { id: '80s',        label: '80s',        emoji: '📼', searchTerm: '80s greatest hits',       color: '#EC4899' },
  { id: '90s',        label: '90s',        emoji: '💿', searchTerm: '90s greatest hits',       color: '#3B82F6' },
  { id: '2000s',      label: '2000s',      emoji: '📀', searchTerm: '2000s hits',              color: '#F97316' },
];

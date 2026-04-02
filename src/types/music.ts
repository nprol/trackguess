export type GameMode = 'daily' | 'genre';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AnswerResult = 'correct' | 'wrong' | 'timeout';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  previewUrl: string;
  artworkUrl: string;
  genre: string;
}

export interface RoundResult {
  track: Track;
  result: AnswerResult;
  userAnswer: string;
  timeMs: number;
}

export interface GameConfig {
  mode: GameMode;
  genreId: string;
  genreLabel: string;
  genreSearchTerm: string;
  rounds: number;
  difficulty: Difficulty;
}

export interface GameSession {
  config: GameConfig;
  tracks: Track[];
  currentRound: number;
  results: RoundResult[];
  score: number;
  startedAt: number;
}

export interface MultipleChoiceOption {
  track: Track;
  isCorrect: boolean;
}

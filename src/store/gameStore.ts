import { create } from 'zustand';
import type { GameSession, GameConfig, RoundResult, AnswerResult, Track } from '@/types/music';

interface GameState {
  session: GameSession | null;

  startSession: (config: GameConfig, tracks: Track[]) => void;
  resetSession: () => void;

  recordAnswer: (result: AnswerResult, userAnswer: string, timeMs: number) => void;
  nextRound: () => void;

  currentTrack: () => Track | null;
  isLastRound: () => boolean;
  isFinished: () => boolean;
  correctCount: () => number;
  wrongCount: () => number;
}

const POINTS_CORRECT = 100;
const POINTS_FAST_BONUS = 50;

export const useGameStore = create<GameState>((set, get) => ({
  session: null,

  startSession: (config, tracks) => {
    set({
      session: {
        config,
        tracks,
        currentRound: 0,
        results: [],
        score: 0,
        startedAt: Date.now(),
      },
    });
  },

  resetSession: () => set({ session: null }),

  recordAnswer: (result, userAnswer, timeMs) => {
    const { session } = get();
    if (!session) return;

    const track = session.tracks[session.currentRound];
    if (!track) return;

    let points = 0;
    if (result === 'correct') {
      points = POINTS_CORRECT;
      if (timeMs < 5000) points += POINTS_FAST_BONUS;
    }

    const roundResult: RoundResult = { track, result, userAnswer, timeMs };

    set({
      session: {
        ...session,
        results: [...session.results, roundResult],
        score: session.score + points,
      },
    });
  },

  nextRound: () => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, currentRound: session.currentRound + 1 } });
  },

  currentTrack: () => {
    const { session } = get();
    if (!session) return null;
    return session.tracks[session.currentRound] ?? null;
  },

  isLastRound: () => {
    const { session } = get();
    if (!session) return false;
    return session.currentRound === session.tracks.length - 1;
  },

  isFinished: () => {
    const { session } = get();
    if (!session) return false;
    return session.currentRound >= session.tracks.length;
  },

  correctCount: () => {
    const { session } = get();
    return session?.results.filter(r => r.result === 'correct').length ?? 0;
  },

  wrongCount: () => {
    const { session } = get();
    return session?.results.filter(r => r.result !== 'correct').length ?? 0;
  },
}));

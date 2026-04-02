import type { Track, MultipleChoiceOption } from '@/types/music';

/**
 * Baraja un array en-place (Fisher-Yates).
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Baraja determinista con semilla (LCG). Misma semilla = mismo orden.
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let s = seed >>> 0;
  const next = () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s / 0x100000000;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Semilla basada en la fecha actual (YYYYMMDD). Cambia cada día.
 */
export function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/**
 * Selecciona N tracks aleatorios del pool (modo género).
 */
export function selectRandomTracks(pool: Track[], count: number): Track[] {
  return shuffle(pool).slice(0, count);
}

/**
 * Selecciona N tracks del pool usando la semilla del día (modo daily).
 * Todos los usuarios obtendrán las mismas canciones ese día.
 */
export function selectDailyTracks(pool: Track[], count: number): Track[] {
  return seededShuffle(pool, getDailySeed()).slice(0, count);
}

/**
 * Genera 4 opciones de múltiple choice (1 correcta + 3 distractoras).
 */
export function generateMultipleChoiceOptions(
  correct: Track,
  allTracks: Track[],
  count = 4,
): MultipleChoiceOption[] {
  const distractorPool = allTracks.filter(t => t.id !== correct.id);
  const distractors = shuffle(distractorPool).slice(0, count - 1);
  const options: MultipleChoiceOption[] = [
    { track: correct, isCorrect: true },
    ...distractors.map(t => ({ track: t, isCorrect: false })),
  ];
  return shuffle(options);
}

/**
 * Calcula el porcentaje de aciertos.
 */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Formatea milisegundos como "X.Xs".
 */
export function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

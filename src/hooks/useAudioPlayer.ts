import { useRef, useState, useCallback, useEffect } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, setAudioModeAsync } from 'expo-audio';

const PREVIEW_DURATION_MS = 10_000;   // 10s que el usuario escucha
const PREVIEW_TOTAL_MS = 30_000;      // iTunes da previews de ~30s

type PlayerStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'stopped' | 'error';

interface UseAudioPlayerReturn {
  status: PlayerStatus;
  progress: number; // 0..1
  load: (previewUrl: string) => Promise<void>;
  play: () => Promise<void>;
  stop: () => Promise<void>;
  unload: () => Promise<void>;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const player = useExpoAudioPlayer(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPositionRef = useRef(0); // en segundos
  const startTimeRef = useRef(0);

  const removedRef = useRef(false);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [progress, setProgress] = useState(0);

  const safeRemove = () => {
    if (!removedRef.current) {
      removedRef.current = true;
      try { player.remove(); } catch {}
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      clearProgressInterval();
      safeRemove();
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const unload = useCallback(async () => {
    clearTimer();
    clearProgressInterval();
    safeRemove();
    setStatus('idle');
    setProgress(0);
  }, [player]);

  const load = useCallback(async (previewUrl: string) => {
    clearTimer();
    clearProgressInterval();
    setStatus('loading');

    try {
      setAudioModeAsync({
        playsInSilentMode: true,
      });

      await player.replace({ uri: previewUrl });

      // iTunes da previews de ~30s — seleccionamos inicio aleatorio
      const totalSeconds = PREVIEW_TOTAL_MS / 1000;
      const clipSeconds = PREVIEW_DURATION_MS / 1000;
      const maxStart = Math.max(0, totalSeconds - clipSeconds);
      startPositionRef.current = Math.random() * maxStart;

      player.seekTo(startPositionRef.current);
      setStatus('ready');
      setProgress(0);
    } catch (err) {
      console.error('[Audio] Load error:', err);
      setStatus('error');
    }
  }, [player]);

  const stop = useCallback(async () => {
    clearTimer();
    clearProgressInterval();
    player.pause();
    setStatus('stopped');
    setProgress(1);
  }, [player]);

  const play = useCallback(async () => {
    if (status === 'playing') return;

    try {
      player.seekTo(startPositionRef.current);
      player.play();
      setStatus('playing');
      setProgress(0);
      startTimeRef.current = Date.now();

      clearProgressInterval();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setProgress(Math.min(elapsed / PREVIEW_DURATION_MS, 1));
      }, 100);

      clearTimer();
      timerRef.current = setTimeout(() => {
        stop();
      }, PREVIEW_DURATION_MS);
    } catch (err) {
      console.error('[Audio] Play error:', err);
      setStatus('error');
    }
  }, [status, stop, player]);

  return { status, progress, load, play, stop, unload };
}

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useGameStore } from '@/store/gameStore';
import { fetchTracksByTerm } from '@/services/itunesApi';
import {
  selectRandomTracks,
  selectDailyTracks,
  generateMultipleChoiceOptions,
} from '@/utils/gameLogic';
import { isCorrectAnswer, isCorrectHardAnswer } from '@/utils/stringMatch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import { Timer } from '@/components/Timer';
import { AnswerOption } from '@/components/AnswerOption';
import { Button } from '@/components/ui/Button';
import type { Difficulty, MultipleChoiceOption, Track } from '@/types/music';
import { colors, spacing, typography, radius } from '@constants/theme';

const TIMER_DURATION = 20_000;

type RoundPhase = 'loading_tracks' | 'ready' | 'waiting_play' | 'playing' | 'answered' | 'error';

export default function PlayScreen() {
  const params = useLocalSearchParams<{
    mode: string;
    genreId: string;
    genreLabel: string;
    genreSearchTerm: string;
    rounds: string;
    difficulty: string;
  }>();
  const router = useRouter();
  const audio = useAudioPlayer();

  const {
    session,
    startSession,
    recordAnswer,
    nextRound,
    currentTrack,
    isLastRound,
  } = useGameStore();

  const [phase, setPhase] = useState<RoundPhase>('loading_tracks');
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<MultipleChoiceOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const roundStartTimeRef = useRef(0);
  const allTracksRef = useRef<Track[]>([]);

  const difficulty = (params.difficulty ?? 'easy') as Difficulty;
  const totalRounds = parseInt(params.rounds ?? '10', 10);
  const isDaily = params.mode === 'daily';

  // ── Carga inicial de tracks desde iTunes ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const tracks = await fetchTracksByTerm(params.genreSearchTerm, 100);

        if (tracks.length < 4) {
          setError('No hay suficientes canciones disponibles. Inténtalo de nuevo.');
          setPhase('error');
          return;
        }

        allTracksRef.current = tracks;
        const selected = isDaily
          ? selectDailyTracks(tracks, Math.min(totalRounds, tracks.length))
          : selectRandomTracks(tracks, Math.min(totalRounds, tracks.length));

        startSession(
          {
            mode: isDaily ? 'daily' : 'genre',
            genreId: params.genreId,
            genreLabel: params.genreLabel,
            rounds: totalRounds,
            difficulty,
          },
          selected,
        );
        setPhase('ready');
      } catch (err: any) {
        setError(err.message ?? 'Error cargando las canciones');
        setPhase('error');
      }
    })();
  }, []);

  // ── Cuando cambia la ronda ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ready') return;
    setupRound();
  }, [phase, session?.currentRound]);

  const setupRound = useCallback(async () => {
    const track = currentTrack();
    if (!track) return;

    setSelectedOption(null);
    setWrittenAnswer('');
    setAnswerRevealed(false);
    setTimerRunning(false);
    setOptions([]);

    if (difficulty === 'easy') {
      setOptions(generateMultipleChoiceOptions(track, allTracksRef.current));
    }

    await audio.load(track.previewUrl);
    setPhase('waiting_play');
  }, [phase, currentTrack, difficulty, audio]);

  // ── Play del fragmento ───────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (audio.status !== 'ready' && audio.status !== 'stopped') return;
    await audio.play();
    roundStartTimeRef.current = Date.now();
    setTimerRunning(true);
    setPhase('playing');
  }, [audio]);

  // ── Verificar respuesta ──────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    async (optionOrText: MultipleChoiceOption | string, isTimeout = false) => {
      if (answerRevealed) return;
      setAnswerRevealed(true);
      setTimerRunning(false);
      await audio.stop();

      const elapsed = Date.now() - roundStartTimeRef.current;
      const track = currentTrack();
      if (!track) return;

      let isCorrect = false;
      let answerText = '';

      if (difficulty === 'easy' && typeof optionOrText !== 'string') {
        isCorrect = optionOrText.isCorrect;
        answerText = optionOrText.track.title;
        setSelectedOption(optionOrText);
      } else if (difficulty === 'medium') {
        answerText = typeof optionOrText === 'string' ? optionOrText : '';
        isCorrect = isTimeout ? false : isCorrectAnswer(answerText, track.title);
      } else {
        answerText = typeof optionOrText === 'string' ? optionOrText : '';
        isCorrect = isTimeout
          ? false
          : isCorrectHardAnswer(answerText, track.title, [track.artist]);
      }

      const result = isTimeout ? 'timeout' : isCorrect ? 'correct' : 'wrong';
      recordAnswer(result, answerText, isTimeout ? TIMER_DURATION : elapsed);

      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      setPhase('answered');
    },
    [answerRevealed, currentTrack, difficulty, audio, recordAnswer],
  );

  const handleTimerExpire = useCallback(() => {
    if (!answerRevealed) handleAnswer('', true);
  }, [answerRevealed, handleAnswer]);

  // ── Siguiente ronda o fin ────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    await audio.unload();
    if (isLastRound()) {
      nextRound();
      router.replace('/game/results');
    } else {
      nextRound();
      setPhase('ready');
    }
  }, [audio, isLastRound, nextRound, router]);

  // ── Renders ──────────────────────────────────────────────────────────────────
  if (phase === 'loading_tracks' || !session) {
    return <LoadingSpinner fullScreen message="Preparando la partida..." />;
  }

  if (phase === 'error') {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon="⚠️"
          title="No se puede iniciar"
          description={error ?? 'Error desconocido'}
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const track = currentTrack();
  if (!track) return null;

  const roundNumber = session.currentRound + 1;
  const roundProgress = roundNumber / session.tracks.length;
  const lastResult = session.results[session.results.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header de ronda */}
          <View style={styles.roundHeader}>
            <Text style={styles.roundText}>
              Ronda {roundNumber} / {session.tracks.length}
            </Text>
            <Text style={styles.scoreText}>{session.score} pts</Text>
          </View>
          <ProgressBar progress={roundProgress} style={styles.roundProgress} />

          {/* Zona de audio */}
          <View style={styles.audioSection}>
            {(phase === 'waiting_play' || phase === 'playing') && (
              <>
                <TouchableOpacity
                  style={[styles.playButton, phase === 'playing' && styles.playButtonActive]}
                  onPress={handlePlay}
                  disabled={phase === 'playing'}
                  accessibilityLabel="Reproducir fragmento"
                >
                  <Text style={styles.playIcon}>{phase === 'playing' ? '▐▐' : '▶'}</Text>
                </TouchableOpacity>
                {phase === 'playing' && (
                  <ProgressBar
                    progress={audio.progress}
                    color={colors.green}
                    height={6}
                    style={styles.audioProgress}
                  />
                )}
                <Text style={styles.playHint}>
                  {phase === 'waiting_play' ? 'Pulsa para escuchar 10 segundos' : 'Escuchando...'}
                </Text>
              </>
            )}

            {(phase === 'playing' || phase === 'answered') && (
              <View style={styles.timer}>
                <Timer
                  durationMs={TIMER_DURATION}
                  running={timerRunning}
                  onExpire={handleTimerExpire}
                />
              </View>
            )}
          </View>

          {/* Respuesta revelada */}
          {phase === 'answered' && lastResult && (
            <View
              style={[
                styles.resultBanner,
                lastResult.result === 'correct' ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              <Text style={styles.resultIcon}>
                {lastResult.result === 'correct' ? '✓' : lastResult.result === 'timeout' ? '⏱' : '✗'}
              </Text>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTrack}>{track.title}</Text>
                <Text style={styles.resultArtist}>{track.artist}</Text>
              </View>
            </View>
          )}

          {/* Zona de respuesta */}
          {phase !== 'waiting_play' && phase !== 'ready' && (
            <View style={styles.answerSection}>
              {difficulty === 'easy' ? (
                <View style={styles.optionsList}>
                  {options.map((opt, i) => {
                    let state: 'default' | 'selected' | 'correct' | 'wrong' = 'default';
                    if (answerRevealed) {
                      if (opt.isCorrect) state = 'correct';
                      else if (selectedOption?.track.id === opt.track.id) state = 'wrong';
                    } else if (selectedOption?.track.id === opt.track.id) {
                      state = 'selected';
                    }
                    return (
                      <AnswerOption
                        key={opt.track.id}
                        option={opt}
                        index={i}
                        state={state}
                        onPress={handleAnswer}
                        disabled={answerRevealed}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={styles.writeAnswerSection}>
                  <TextInput
                    style={[
                      styles.textInput,
                      answerRevealed && lastResult?.result === 'correct' && styles.textInputCorrect,
                      answerRevealed && lastResult?.result !== 'correct' && styles.textInputWrong,
                    ]}
                    placeholder={
                      difficulty === 'hard'
                        ? 'Título · Artista (ej: Bohemian Rhapsody Queen)'
                        : 'Título de la canción...'
                    }
                    placeholderTextColor={colors.textMuted}
                    value={writtenAnswer}
                    onChangeText={setWrittenAnswer}
                    editable={!answerRevealed}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      if (!answerRevealed && writtenAnswer.trim()) handleAnswer(writtenAnswer);
                    }}
                    accessibilityLabel="Escribe tu respuesta"
                  />
                  {!answerRevealed && (
                    <Button
                      label="Confirmar"
                      onPress={() => handleAnswer(writtenAnswer)}
                      disabled={!writtenAnswer.trim()}
                      fullWidth
                    />
                  )}
                </View>
              )}
            </View>
          )}

          {/* Botón siguiente */}
          {phase === 'answered' && (
            <Button
              label={isLastRound() ? 'Ver resultados' : 'Siguiente ronda →'}
              onPress={handleNext}
              size="lg"
              fullWidth
              style={styles.nextButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundText: { ...typography.label, color: colors.textSecondary },
  scoreText: { ...typography.label, color: colors.green },
  roundProgress: { marginBottom: spacing.xs },
  audioSection: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  playButtonActive: {
    backgroundColor: colors.greenDark,
    opacity: 0.8,
  },
  playIcon: {
    fontSize: 28,
    lineHeight: 34,
    color: colors.bg,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
  audioProgress: { width: '100%' },
  playHint: { ...typography.bodySmall, color: colors.textMuted },
  timer: { width: '60%' },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  resultCorrect: { backgroundColor: '#1a4a2e' },
  resultWrong: { backgroundColor: '#3a1a1e' },
  resultIcon: { fontSize: 28 },
  resultInfo: { flex: 1, gap: 2 },
  resultTrack: { ...typography.label, color: colors.textPrimary },
  resultArtist: { ...typography.bodySmall, color: colors.textSecondary },
  answerSection: { gap: spacing.md },
  optionsList: { gap: spacing.sm },
  writeAnswerSection: { gap: spacing.md },
  textInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
  },
  textInputCorrect: { borderColor: colors.green, backgroundColor: '#1a3a22' },
  textInputWrong: { borderColor: colors.error, backgroundColor: '#3a1a1e' },
  nextButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});

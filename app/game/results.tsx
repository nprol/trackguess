import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography, radius } from '@constants/theme';
import { calcAccuracy, formatTime } from '@/utils/gameLogic';
import type { RoundResult } from '@/types/music';

function getDailyKey() {
  const d = new Date();
  return `daily_done_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { session, correctCount, wrongCount, resetSession } = useGameStore();

  useEffect(() => {
    if (!session) { router.replace('/'); return; }
    if (session.config.mode === 'daily') {
      AsyncStorage.setItem(getDailyKey(), '1');
    }
  }, [session]);

  if (!session) return null;

  const correct = correctCount();
  const wrong = wrongCount();
  const total = session.results.length;
  const accuracy = calcAccuracy(correct, total);

  const getRankEmoji = () => {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 70) return '🥈';
    if (accuracy >= 50) return '🥉';
    return '🎵';
  };

  const getRankMessage = () => {
    if (accuracy >= 90) return '¡Maestro de la música!';
    if (accuracy >= 70) return '¡Muy buen oído!';
    if (accuracy >= 50) return 'Nada mal, sigue practicando';
    return 'Hay que escuchar más música';
  };

  const handlePlayAgain = () => {
    resetSession();
    router.push({
      pathname: '/game/setup',
      params: {
        mode: session.config.mode,
        genreId: session.config.genreId,
        genreLabel: session.config.genreLabel,
      },
    });
  };

  const handleHome = () => {
    resetSession();
    router.replace('/');
  };

  const renderResult = ({ item, index }: { item: RoundResult; index: number }) => {
    const isCorrect = item.result === 'correct';

    return (
      <View style={styles.resultRow}>
        <Text style={styles.resultNumber}>{index + 1}</Text>
        {item.track.artworkUrl ? (
          <Image source={{ uri: item.track.artworkUrl }} style={styles.albumThumb} />
        ) : (
          <View style={[styles.albumThumb, styles.albumThumbPlaceholder]}>
            <Text>🎵</Text>
          </View>
        )}
        <View style={styles.resultInfo}>
          <Text style={styles.resultTrack} numberOfLines={1}>{item.track.title}</Text>
          <Text style={styles.resultArtist} numberOfLines={1}>{item.track.artist}</Text>
          {!isCorrect && item.userAnswer && item.result !== 'timeout' && (
            <Text style={styles.resultUserAnswer} numberOfLines={1}>
              Tu respuesta: {item.userAnswer}
            </Text>
          )}
        </View>
        <View style={styles.resultBadge}>
          <Text style={styles.resultIcon}>
            {item.result === 'correct' ? '✓' : item.result === 'timeout' ? '⏱' : '✗'}
          </Text>
          {item.result === 'correct' && (
            <Text style={styles.resultTime}>{formatTime(item.timeMs)}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={session.results}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderResult}
        ListHeaderComponent={
          <>
            <LinearGradient colors={['#1a3a22', colors.bg]} style={styles.hero}>
              <Text style={styles.heroEmoji}>{getRankEmoji()}</Text>
              <Text style={styles.heroScore}>{session.score}</Text>
              <Text style={styles.heroScoreLabel}>puntos</Text>
              <Text style={styles.heroMessage}>{getRankMessage()}</Text>
              <Text style={styles.heroGenre}>{session.config.genreLabel}</Text>
            </LinearGradient>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{correct}</Text>
                <Text style={[styles.statLabel, { color: colors.green }]}>Aciertos</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{wrong}</Text>
                <Text style={[styles.statLabel, { color: colors.error }]}>Fallos</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </Card>
            </View>

            <Text style={styles.listHeader}>Canciones de la partida</Text>
          </>
        }
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.scroll}
        ListFooterComponent={
          <View style={styles.actions}>
            <Button label="Jugar otra vez" onPress={handlePlayAgain} size="lg" fullWidth />
            <Button label="Inicio" onPress={handleHome} variant="secondary" size="lg" fullWidth />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
    overflow: 'visible',
  },
  heroEmoji: { fontSize: 64, lineHeight: 80 },
  heroScore: {
    ...typography.h1,
    fontSize: 64,
    color: colors.green,
    fontWeight: '900',
  },
  heroScoreLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  heroMessage: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  heroGenre: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: { ...typography.h2, color: colors.textPrimary },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listHeader: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  resultNumber: {
    ...typography.caption,
    color: colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
  albumThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
  },
  albumThumbPlaceholder: {
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: { flex: 1, gap: 2 },
  resultTrack: { ...typography.label, color: colors.textPrimary },
  resultArtist: { ...typography.caption, color: colors.textSecondary },
  resultUserAnswer: {
    ...typography.caption,
    color: colors.error,
    fontStyle: 'italic',
  },
  resultBadge: {
    alignItems: 'center',
    gap: 2,
    minWidth: 36,
  },
  resultIcon: { fontSize: 20 },
  resultTime: { ...typography.caption, color: colors.textMuted },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
});

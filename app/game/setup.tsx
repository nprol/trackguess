import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Difficulty } from '@/types/music';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography, radius } from '@constants/theme';

type Rounds = 5 | 10 | 20;

const ROUND_OPTIONS: Rounds[] = [5, 10, 20];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy',   label: 'Fácil',    description: 'Elige entre 4 opciones' },
  { value: 'medium', label: 'Medio',    description: 'Escribe el título de la canción' },
  { value: 'hard',   label: 'Difícil',  description: 'Escribe título y artista' },
];

export default function GameSetupScreen() {
  const { mode, genreId, genreLabel, genreSearchTerm } = useLocalSearchParams<{
    mode: string;
    genreId: string;
    genreLabel: string;
    genreSearchTerm: string;
  }>();
  const router = useRouter();

  const [rounds, setRounds] = useState<Rounds>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStart = () => {
    router.push({
      pathname: '/game/play',
      params: {
        mode,
        genreId,
        genreLabel,
        genreSearchTerm,
        rounds: String(rounds),
        difficulty,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Género seleccionado */}
        <Card style={styles.genreInfo}>
          <Text style={styles.genreInfoLabel}>
            {mode === 'daily' ? 'Modo' : 'Género seleccionado'}
          </Text>
          <Text style={styles.genreInfoName}>{genreLabel}</Text>
        </Card>

        {/* Rondas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Número de rondas</Text>
          <View style={styles.optionsRow}>
            {ROUND_OPTIONS.map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.chip, rounds === r && styles.chipActive]}
                onPress={() => setRounds(r)}
                accessibilityRole="radio"
                accessibilityState={{ checked: rounds === r }}
              >
                <Text style={[styles.chipText, rounds === r && styles.chipTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dificultad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dificultad</Text>
          <View style={styles.difficultyOptions}>
            {DIFFICULTY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.difficultyCard, difficulty === opt.value && styles.difficultyCardActive]}
                onPress={() => setDifficulty(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: difficulty === opt.value }}
              >
                <Text style={[styles.difficultyLabel, difficulty === opt.value && styles.difficultyLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.difficultyDesc}>{opt.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA */}
        <Button
          label="¡Empezar partida!"
          onPress={handleStart}
          size="lg"
          fullWidth
          style={styles.startButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  genreInfo: {
    gap: spacing.xs,
  },
  genreInfoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  genreInfoName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: colors.green,
    backgroundColor: '#1a3a22',
  },
  chipText: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.green,
  },
  difficultyOptions: {
    gap: spacing.sm,
  },
  difficultyCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  difficultyCardActive: {
    borderColor: colors.green,
    backgroundColor: '#1a3a22',
  },
  difficultyLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  difficultyLabelActive: {
    color: colors.green,
  },
  difficultyDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  startButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});

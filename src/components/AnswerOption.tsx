import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import type { MultipleChoiceOption } from '@/types/music';
import { colors, radius, spacing, typography } from '@constants/theme';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

interface AnswerOptionProps {
  option: MultipleChoiceOption;
  index: number;
  state: OptionState;
  onPress: (option: MultipleChoiceOption) => void;
  disabled?: boolean;
}

const LABELS = ['A', 'B', 'C', 'D'];

export function AnswerOption({ option, index, state, onPress, disabled }: AnswerOptionProps) {
  const bgColor = {
    default: colors.bgCard,
    selected: colors.bgCardHover,
    correct: '#1a4a2e',
    wrong: '#4a1a1e',
  }[state];

  const borderColor = {
    default: colors.border,
    selected: colors.textSecondary,
    correct: colors.green,
    wrong: colors.error,
  }[state];

  const icon = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : null;

  return (
    <TouchableOpacity
      onPress={() => onPress(option)}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Opción ${LABELS[index]}: ${option.track.title}`}
      style={[styles.container, { backgroundColor: bgColor, borderColor }]}
    >
      <View style={[styles.label, { borderColor }]}>
        <Text style={[styles.labelText, state !== 'default' && { color: borderColor }]}>
          {icon ?? LABELS[index]}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {option.track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {option.track.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.sm + 2,
    gap: spacing.sm,
  },
  label: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.border,
  },
  labelText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.label,
    color: colors.textPrimary,
  },
  artist: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

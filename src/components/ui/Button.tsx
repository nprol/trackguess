import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radius, typography, spacing } from '@constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<Variant, object> = {
  primary:   { backgroundColor: colors.green },
  secondary: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  ghost:     { backgroundColor: 'transparent' },
  danger:    { backgroundColor: colors.error },
};

const variantTextStyles: Record<Variant, object> = {
  primary:   { color: colors.bg },
  secondary: { color: colors.textPrimary },
  ghost:     { color: colors.green },
  danger:    { color: colors.white },
};

const sizeStyles: Record<Size, object> = {
  sm: { paddingHorizontal: spacing.md,  paddingVertical: spacing.xs + 2 },
  md: { paddingHorizontal: spacing.xl,  paddingVertical: spacing.sm + 4 },
  lg: { paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
};

const sizeTextStyles: Record<Size, object> = {
  sm: { ...typography.bodySmall, fontWeight: '600' as const },
  md: { ...typography.body,      fontWeight: '700' as const },
  lg: { ...typography.h4,        fontWeight: '700' as const },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.bg : colors.green}
        />
      ) : (
        <Text style={[styles.text, variantTextStyles[variant], sizeTextStyles[size]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.45 },
  text:      { fontWeight: '700', letterSpacing: 0.5 },
});

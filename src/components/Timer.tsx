import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography } from '@constants/theme';
import { ProgressBar } from './ProgressBar';

interface TimerProps {
  durationMs: number;
  running: boolean;
  onExpire: () => void;
}

export function Timer({ durationMs, running, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(durationMs);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Pulso cuando quedan menos de 5s
  useEffect(() => {
    if (remaining <= 5000 && running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [remaining <= 5000, running]);

  useEffect(() => {
    setRemaining(durationMs);
    expiredRef.current = false;
  }, [durationMs]);

  useEffect(() => {
    clear();
    if (!running) return;

    const tick = 100;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - tick;
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          clear();
          return 0;
        }
        return Math.max(next, 0);
      });
    }, tick);

    return clear;
  }, [running]);

  // Llama onExpire fuera del setter para no actualizar otro componente durante el render
  useEffect(() => {
    if (remaining === 0 && expiredRef.current) {
      onExpire();
    }
  }, [remaining]);

  const seconds = Math.ceil(remaining / 1000);
  const progress = remaining / durationMs;
  const isLow = remaining <= 5000;

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          isLow && styles.textLow,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {seconds}s
      </Animated.Text>
      <ProgressBar
        progress={progress}
        color={isLow ? colors.error : colors.green}
        height={6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },
  text: {
    ...typography.h2,
    color: colors.green,
    fontVariant: ['tabular-nums'],
  },
  textLow: {
    color: colors.error,
  },
});

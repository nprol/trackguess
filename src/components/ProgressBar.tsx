import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radius } from '@constants/theme';

interface ProgressBarProps {
  progress: number; // 0..1
  color?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = colors.green,
  height = 4,
  style,
  animated = true,
}: ProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: Math.min(Math.max(progress, 0), 1),
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(Math.min(Math.max(progress, 0), 1));
    }
  }, [progress, animated, widthAnim]);

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: color,
            borderRadius: height / 2,
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.bgCardHover,
    overflow: 'hidden',
  },
  fill: {},
});

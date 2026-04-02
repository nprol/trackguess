import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography, radius } from '@constants/theme';
import { DAILY_GENRE } from '@constants/genres';

const HOW_IT_WORKS = [
  { icon: '🎧', text: 'Escucha 10 segundos de cada canción' },
  { icon: '🧠', text: 'Adivina el título (y artista en difícil)' },
  { icon: '⚡', text: 'Responde rápido para ganar bonus de velocidad' },
  { icon: '🏆', text: 'Consigue la puntuación más alta' },
];

function getDailyKey() {
  const d = new Date();
  return `daily_done_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(getDailyKey()).then(val => {
      if (val === '1') setDailyDone(true);
    });
  }, []);

  const handleDaily = () => {
    if (dailyDone) return;
    router.push({
      pathname: '/game/setup',
      params: {
        mode: 'daily',
        genreId: DAILY_GENRE.id,
        genreLabel: DAILY_GENRE.label,
        genreSearchTerm: DAILY_GENRE.searchTerm,
      },
    });
  };

  const handleGenres = () => {
    router.push('/genres');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#1a2a1a', colors.bg, colors.bg]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🎵</Text>
          </View>
          <Text style={styles.appName}>TrackGuess</Text>
          <Text style={styles.tagline}>¿Cuántas canciones reconoces en 10 segundos?</Text>
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          style={[styles.dailyCard, dailyDone && styles.dailyCardDone]}
          onPress={handleDaily}
          activeOpacity={dailyDone ? 1 : 0.85}
        >
          <LinearGradient
            colors={dailyDone ? ['#1a1a1a', '#111'] : ['#1a3a22', '#0f2016']}
            style={styles.dailyGradient}
          >
            <Text style={styles.dailyEmoji}>{dailyDone ? '✅' : '📅'}</Text>
            <View style={styles.dailyInfo}>
              <Text style={styles.dailyTitle}>Reto del Día</Text>
              <Text style={styles.dailyDesc}>
                {dailyDone
                  ? 'Ya completaste el reto de hoy. ¡Vuelve mañana!'
                  : 'Las mismas canciones para todos, renovadas cada día'}
              </Text>
            </View>
            {!dailyDone && <Text style={styles.dailyArrow}>›</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {/* Genre Mode */}
        <Button
          label="Jugar por género"
          onPress={handleGenres}
          variant="secondary"
          size="lg"
          fullWidth
        />

        {/* How it works */}
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>Cómo funciona</Text>
          <View style={styles.howList}>
            {HOW_IT_WORKS.map((item, i) => (
              <View key={i} style={styles.howRow}>
                <Text style={styles.howIcon}>{item.icon}</Text>
                <Text style={styles.howText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.xl,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: { fontSize: 50 },
  appName: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  dailyCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  dailyCardDone: {
    opacity: 0.7,
  },
  dailyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: radius.lg,
  },
  dailyEmoji: { fontSize: 36 },
  dailyInfo: { flex: 1, gap: spacing.xs },
  dailyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  dailyDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dailyArrow: {
    fontSize: 28,
    color: colors.green,
    fontWeight: '300',
  },
  howSection: {
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  howTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  howList: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  howIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  howText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
});

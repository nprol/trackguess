import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GENRES } from '@constants/genres';
import { colors, spacing, typography, radius } from '@constants/theme';

const NUM_COLUMNS = 2;
const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.lg * 2 - spacing.sm) / 2;

export default function GenresScreen() {
  const router = useRouter();

  const handleSelect = (genre: typeof GENRES[0]) => {
    router.push({
      pathname: '/game/setup',
      params: {
        mode: 'genre',
        genreId: genre.id,
        genreLabel: genre.label,
        genreSearchTerm: genre.searchTerm,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={GENRES}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderColor: item.color }]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.emojiContainer, { backgroundColor: item.color + '22' }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 30 },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
});

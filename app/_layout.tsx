import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Inicio' }} />
        <Stack.Screen name="genres" options={{ title: 'Elige un género' }} />
        <Stack.Screen name="game/setup" options={{ title: 'Configurar partida' }} />
        <Stack.Screen name="game/play" options={{ headerShown: false }} />
        <Stack.Screen name="game/results" options={{ headerShown: false, title: 'Resultados' }} />
      </Stack>
    </>
  );
}

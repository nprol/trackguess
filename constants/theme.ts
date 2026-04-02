export const colors = {
  // Spotify palette
  green: '#1DB954',
  greenDark: '#158f3f',
  greenLight: '#1ed760',

  // Backgrounds (dark)
  bg: '#121212',
  bgElevated: '#181818',
  bgCard: '#282828',
  bgCardHover: '#3e3e3e',

  // Text
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#6B6B6B',

  // Feedback
  success: '#1DB954',
  error: '#F15E6C',
  warning: '#F59B23',

  // Misc
  border: '#333333',
  overlay: 'rgba(0,0,0,0.7)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
} as const;

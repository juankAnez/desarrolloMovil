// Design System PRO - FocusUp v2.0
// Inspirado en Linear / Notion / Revolut premium

export const colors = {
  // Brand - Indigo/Violet premium
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  primaryMuted: '#eef2ff',
  primaryGradient: ['#6366f1', '#8b5cf6', '#a855f7'],

  // Secondary
  secondary: '#ec4899',
  accent: '#06b6d4',
  accentLight: '#22d3ee',

  // Semantic
  success: '#10b981',
  successLight: '#d1fae5',
  successDark: '#059669',
  error: '#ef4444',
  errorLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef3c7',

  // Neutrals - Slate scale (profesional)
  background: '#f8fafc',
  backgroundLight: '#ffffff',
  backgroundCard: '#ffffff',
  backgroundMuted: '#f1f5f9',
  backgroundDark: '#0f172a',
  surface: '#f8fafc',

  // Text - tipografía jerárquica
  text: '#0f172a',           // slate-900
  textSecondary: '#475569',  // slate-600
  textTertiary: '#94a3b8',   // slate-400
  textMuted: '#cbd5e1',      // slate-300
  textWhite: '#ffffff',
  textInverse: '#f8fafc',

  // UI
  border: '#e2e8f0',         // slate-200
  borderLight: '#f1f5f9',    // slate-100
  borderStrong: '#cbd5e1',   // slate-300
  divider: '#e2e8f0',
  disabled: '#cbd5e1',
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlayLight: 'rgba(15, 23, 42, 0.04)',

  // Habit colors - paleta curada
  habitStudy: '#6366f1',
  habitWater: '#06b6d4',
  habitReading: '#f59e0b',
  habitExercise: '#ec4899',
  habitHealth: '#10b981',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 28,
  full: 9999,
};

export const shadows = {
  xs: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const typography = {
  h1: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.6, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, lineHeight: 24 },
  h4: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500', letterSpacing: 0.3, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, lineHeight: 14, textTransform: 'uppercase' },
};

export const gradients = {
  primary: ['#6366f1', '#8b5cf6'],
  primaryVertical: ['#6366f1', '#4f46e5'],
  success: ['#10b981', '#06b6d4'],
  warning: ['#f59e0b', '#f97316'],
  dark: ['#0f172a', '#1e293b'],
  mesh: ['#eef2ff', '#f8fafc'],
};

// Helpers
export const getHabitColor = (category) => {
  const map = {
    Estudio: colors.habitStudy,
    Hidratación: colors.habitWater,
    Lectura: colors.habitReading,
    Ejercicio: colors.habitExercise,
    Salud: colors.habitHealth,
  };
  return map[category] || colors.primary;
};

export const categoryConfig = {
  Estudio: { icon: 'book-open-outline', color: '#6366f1', bg: '#eef2ff' },
  Ejercicio: { icon: 'dumbbell', color: '#ec4899', bg: '#fce7f3' },
  Lectura: { icon: 'book-open-page-variant-outline', color: '#f59e0b', bg: '#fef3c7' },
  Hidratación: { icon: 'water-outline', color: '#06b6d4', bg: '#cffafe' },
  Salud: { icon: 'heart-pulse', color: '#10b981', bg: '#d1fae5' },
  Trabajo: { icon: 'briefcase-outline', color: '#8b5cf6', bg: '#ede9fe' },
};

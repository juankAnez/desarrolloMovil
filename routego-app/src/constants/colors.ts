/**
 * RouteGo Design System Tokens
 * Modern collegiate transit palette
 */

export const AppColors = {
  // Brand
  primary: '#000666',         // RouteGo Signature Deep Navy
  primaryLight: '#0E1E82',    // Lighter Navy
  primaryDark: '#000333',     // Darkest Navy
  accent: '#2563EB',          // Electric Blue
  accentLight: '#EFF6FF',     // Subtle Blue Tint
  accentBorder: '#BFDBFE',    // Blue Outline

  // Semantic Status
  success: '#10B981',         // Active / On-time (Emerald)
  successLight: '#ECFDF5',
  successDark: '#047857',

  warning: '#F59E0B',         // Delayed / Caution (Amber)
  warningLight: '#FFFBEB',
  warningDark: '#B45309',

  danger: '#EF4444',          // Disruption / Emergency (Rose)
  dangerLight: '#FEF2F2',
  dangerDark: '#B91C1C',

  info: '#3B82F6',
  infoLight: '#EFF6FF',
  infoDark: '#1D4ED8',

  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',

  // Neutrals / Surfaces
  background: '#F8FAFC',      // Slate 50
  surface: '#FFFFFF',         // Pure White Card
  surfaceSubtle: '#F1F5F9',   // Slate 100
  surfaceAlt: '#E2E8F0',      // Slate 200

  // Text
  text: '#0F172A',            // Slate 900
  textSecondary: '#475569',   // Slate 600
  textMuted: '#94A3B8',       // Slate 400
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

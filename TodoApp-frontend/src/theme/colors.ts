/**
 * theme/colors.ts
 *
 * Central design tokens for the app. Keeping colors/spacing/radii here
 * (instead of hardcoding hex values in every screen) makes the UI easy
 * to re-skin later and keeps every screen visually consistent.
 *
 * Palette: a dark "midnight violet" theme — deep indigo background,
 * a vivid purple primary, and a mint-green accent for success/completed
 * states. Reads as modern and a bit more "designed" than default RN grey.
 */

export const colors = {
  // Backgrounds
  background: '#0F0E17', // app background
  surface: '#1A1926', // cards, inputs, elevated surfaces
  surfaceAlt: '#211F30', // slightly lighter surface (e.g. pressed state)

  // Brand
  primary: '#7F5AF0', // main interactive color (buttons, active states)
  primaryDark: '#6246EA', // pressed/darker variant of primary

  // Semantic
  success: '#2CB67D', // completed tasks, success states
  warning: '#FF8906', // medium priority / due-soon
  danger: '#E45858', // high priority / delete / errors

  // Text
  textPrimary: '#FFFFFE',
  textSecondary: '#94A1B2',
  textMuted: '#5C6470',

  // Borders / dividers
  border: '#2E2C3B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};
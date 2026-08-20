/**
 * RepAlong design tokens — colors, typography, spacing, shape, and motion timing.
 *
 * Exact palette values are chosen and WCAG-verified in docs/brand-system.md — do not
 * tweak a hex value here without re-checking contrast there. Semantic names only:
 * components should never reach for a raw hex value.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FBFAF6',
    backgroundElevated: '#FFFFFF',
    surface: '#F1F3EF',
    surfaceSecondary: '#E7EAE4',

    textPrimary: '#1F2A24',
    textSecondary: '#55625C',
    textMuted: '#647169',
    textInverse: '#FFFFFF',

    brandPrimary: '#0B8050',
    brandPrimaryPressed: '#086A42',
    brandPrimarySoft: '#E4F5EC',

    brandSecondary: '#0C7A88',
    brandSecondarySoft: '#E1F4F6',

    accent: '#D9622E',
    accentSoft: '#FDEAE3',

    border: '#DDE2DC',
    borderStrong: '#B9C2BB',

    success: '#0B8050',
    successSoft: '#E4F5EC',
    warning: '#B54708',
    warningSoft: '#FDF3E7',
    danger: '#C1401F',
    dangerSoft: '#FDF1EC',
    info: '#1B63C4',
    infoSoft: '#EEF4FD',
  },
  dark: {
    background: '#121815',
    backgroundElevated: '#1B221E',
    surface: '#212A25',
    surfaceSecondary: '#2A342E',

    textPrimary: '#F3F5F1',
    textSecondary: '#C4CCC5',
    textMuted: '#8FA095',
    textInverse: '#121815',

    brandPrimary: '#22C081',
    brandPrimaryPressed: '#1AA06B',
    brandPrimarySoft: '#163828',

    brandSecondary: '#2DD4E0',
    brandSecondarySoft: '#123338',

    accent: '#FF8A5B',
    accentSoft: '#3A2419',

    border: '#34403A',
    borderStrong: '#46554D',

    success: '#22C081',
    successSoft: '#163828',
    warning: '#F0A020',
    warningSoft: '#3A2A12',
    danger: '#FF6B57',
    dangerSoft: '#3A1D17',
    info: '#5B9DFF',
    infoSoft: '#16283F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Fixed brand palette for the approved RepAlong RA mark (`RepAlongMark`) and its raster
 * exports (`assets/brand/`) — deliberately NOT part of `Colors.light`/`Colors.dark`.
 * These are the approved-board hex values verbatim; a logo mark stays visually constant
 * across app theme rather than inverting with light/dark mode like functional UI chrome.
 * Never reach for these outside logo artwork — screens use the WCAG-verified tokens in
 * `Colors` instead. See docs/brand-system.md §7 for the fixed-vs-functional distinction.
 */
export const BrandMark = {
  deepForest: '#0F3D2E',
  vitalityGreen: '#1DB56A',
  aquaTeal: '#22C1B1',
  warmCoral: '#FF6B6B',
  warmOffWhite: '#FAFAF6',
  slate: '#2B2F33',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Reusable type styles. Screens should reach for these instead of ad hoc fontSize/lineHeight. */
export const Typography = {
  display: { fontSize: 40, lineHeight: 46, fontWeight: '700' as const },
  headlineLarge: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  headline: { fontSize: 26, lineHeight: 32, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: '500' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' as const },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.2 },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Corner radii. One consistent value per surface kind — screens should not invent new ones. */
export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
  button: 14,
  input: 14,
  card: 20,
  chip: 999,
  avatar: 999,
  sheet: 28,
} as const;

export const BorderWidths = {
  hairline: Platform.select({ web: 1, default: 0.5 }) ?? 0.5,
  thin: 1,
  medium: 1.5,
  thick: 2,
} as const;

export const IconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const ControlHeights = {
  sm: 36,
  md: 48,
  lg: 56,
} as const;

/** Elevation. Android uses `elevation`; iOS/web read the shadow* properties. */
export const Shadows = {
  none: {},
  sm: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

/** Restrained motion durations (ms). Components should skip these entirely under reduced motion. */
export const Motion = {
  quick: 120,
  base: 200,
  slow: 320,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

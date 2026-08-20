import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type BrandBadgeProps = {
  label: string;
  tone?: BrandBadgeTone;
};

/** Glyph accompanies color on every tone so status is never conveyed by color alone. */
const TONE_GLYPH: Record<BrandBadgeTone, string> = {
  neutral: '•',
  success: '✓',
  warning: '!',
  danger: '✕',
  info: 'i',
};

export function BrandBadge({ label, tone = 'neutral' }: BrandBadgeProps) {
  const theme = useTheme();

  const toneColors = {
    neutral: { fg: theme.textSecondary, bg: theme.surface },
    success: { fg: theme.success, bg: theme.successSoft },
    warning: { fg: theme.warning, bg: theme.warningSoft },
    danger: { fg: theme.danger, bg: theme.dangerSoft },
    info: { fg: theme.info, bg: theme.infoSoft },
  } as const;
  const { fg, bg } = toneColors[tone];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText type="caption" style={[styles.glyph, { color: fg }]} accessibilityElementsHidden>
        {TONE_GLYPH[tone]}
      </ThemedText>
      <ThemedText type="caption" style={{ color: fg }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    alignSelf: 'flex-start',
  },
  glyph: {
    fontWeight: '700',
  },
});

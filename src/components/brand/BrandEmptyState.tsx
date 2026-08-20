import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandEmptyStateProps = PropsWithChildren<{
  glyph?: string;
  title: string;
  message?: string;
}>;

export function BrandEmptyState({ glyph = '○', title, message, children }: BrandEmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.glyphWrap, { backgroundColor: theme.surface }]}>
        <ThemedText type="headline" themeColor="textMuted" accessibilityElementsHidden>
          {glyph}
        </ThemedText>
      </View>
      <ThemedText type="title" style={styles.center}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
          {message}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  glyphWrap: {
    width: 64,
    height: 64,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  center: {
    textAlign: 'center',
  },
});

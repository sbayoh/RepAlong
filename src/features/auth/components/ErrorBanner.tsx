import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Inline form-level validation error — see BrandErrorState for section/screen-level failures. */
export function ErrorBanner({ message }: { message: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.dangerSoft }]} accessibilityRole="alert">
      <ThemedText type="bodySmall" themeColor="danger" style={styles.text}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  text: {
    textAlign: 'center',
  },
});

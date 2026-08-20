import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandLoadingStateProps = {
  label?: string;
};

export function BrandLoadingState({ label }: BrandLoadingStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={theme.brandPrimary} />
      {label ? (
        <ThemedText type="bodySmall" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
  },
});

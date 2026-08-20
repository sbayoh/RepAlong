import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandButton } from '@/components/brand/BrandButton';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandErrorStateProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/** Section/screen-level failure state — distinct from the inline form-field error on BrandTextField. */
export function BrandErrorState({ message, onRetry, retryLabel = 'Try again' }: BrandErrorStateProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.dangerSoft }]}
      accessibilityRole="alert">
      <ThemedText type="bodySmall" themeColor="danger" style={styles.message}>
        {message}
      </ThemedText>
      {onRetry ? <BrandButton label={retryLabel} variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.card,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  message: {
    textAlign: 'center',
  },
});

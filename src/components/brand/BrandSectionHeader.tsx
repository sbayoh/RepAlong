import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type BrandSectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function BrandSectionHeader({ title, subtitle }: BrandSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="title">{title}</ThemedText>
      {subtitle ? (
        <ThemedText type="body" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.half,
  },
});

import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandCardProps = ViewProps & {
  elevated?: boolean;
};

export function BrandCard({ style, elevated = true, ...rest }: BrandCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
        elevated && Shadows.sm,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
  },
});

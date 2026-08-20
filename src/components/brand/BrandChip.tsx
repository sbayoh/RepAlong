import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ControlHeights, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandChipProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  selected?: boolean;
};

export function BrandChip({ label, selected = false, ...rest }: BrandChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.brandPrimarySoft : theme.surface,
          borderColor: selected ? theme.brandPrimary : theme.border,
        },
        pressed && styles.pressed,
      ]}
      {...rest}>
      <ThemedText type="bodySmall" themeColor={selected ? 'brandPrimary' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: ControlHeights.sm,
    borderRadius: Radii.chip,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.75,
  },
});

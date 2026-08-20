import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSizes, Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandIconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  /** A single glyph/emoji character — this component has no icon-font dependency. */
  glyph: string;
  accessibilityLabel: string;
  size?: keyof typeof IconSizes;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function BrandIconButton({ glyph, size = 'md', disabled, ...rest }: BrandIconButtonProps) {
  const theme = useTheme();
  const dimension = IconSizes[size] + 24;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [
        styles.button,
        {
          width: dimension,
          height: dimension,
          backgroundColor: theme.surface,
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      {...rest}>
      <ThemedText style={{ fontSize: IconSizes[size] }}>{glyph}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});

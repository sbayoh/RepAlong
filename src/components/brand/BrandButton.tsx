import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ControlHeights, Motion, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandButtonVariant = 'primary' | 'secondary' | 'ghost';

export type BrandButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: BrandButtonVariant;
  loading?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BrandButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: BrandButtonProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    (event) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue.value assignment is the sanctioned mutation API, not a plain React value.
      if (!reducedMotion) scale.value = withTiming(0.97, { duration: Motion.quick });
      onPressIn?.(event);
    },
    [onPressIn, reducedMotion, scale],
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    (event) => {
      // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue.value assignment is the sanctioned mutation API, not a plain React value.
      if (!reducedMotion) scale.value = withTiming(1, { duration: Motion.quick });
      onPressOut?.(event);
    },
    [onPressOut, reducedMotion, scale],
  );

  const variantStyle = {
    primary: { backgroundColor: theme.brandPrimary, borderWidth: 0 },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderStrong,
    },
    ghost: { backgroundColor: theme.surface, borderWidth: 0 },
  }[variant];

  const labelColor = variant === 'primary' ? 'textInverse' : 'textPrimary';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, variantStyle, isDisabled && styles.disabled, animatedStyle]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.textInverse : theme.textPrimary} />
      ) : (
        <ThemedText type="button" themeColor={labelColor}>
          {label}
        </ThemedText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: ControlHeights.md,
    borderRadius: Radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  disabled: {
    opacity: 0.5,
  },
});

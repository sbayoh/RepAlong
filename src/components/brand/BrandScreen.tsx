import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { MaxContentWidth, Motion, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandScreenProps = PropsWithChildren<{
  /** Wraps content in a ScrollView + KeyboardAvoidingView — use for forms. */
  scrollable?: boolean;
  padded?: boolean;
  contentStyle?: ViewStyle;
}>;

/**
 * Standard screen shell: theme background, safe-area insets, centered max-width column,
 * and a restrained entrance fade (skipped under Reduce Motion). Every top-level RepAlong
 * screen should render through this rather than composing SafeAreaView by hand.
 */
export function BrandScreen({ scrollable = false, padded = true, contentStyle, children }: BrandScreenProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  const inner = (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(Motion.slow)}
      style={[styles.content, padded && styles.padded, contentStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', default: undefined })}>
          {scrollable ? (
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
              {inner}
            </ScrollView>
          ) : (
            inner
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  padded: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
});

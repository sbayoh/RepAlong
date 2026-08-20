import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandIconButton } from '@/components/brand/BrandIconButton';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export const ONBOARDING_STEP_COUNT = 8;

export type OnboardingStepHeaderProps = {
  step: number;
};

export function OnboardingStepHeader({ step }: OnboardingStepHeaderProps) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.row}>
      {canGoBack ? (
        <BrandIconButton glyph="←" accessibilityLabel="Back" onPress={() => router.back()} />
      ) : (
        <View style={styles.spacer} />
      )}
      <ThemedText type="caption" themeColor="textMuted">
        Step {step} of {ONBOARDING_STEP_COUNT}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  spacer: {
    width: 44,
    height: 44,
  },
});

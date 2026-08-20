import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandChip } from '@/components/brand/BrandChip';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { GOALS, GOAL_LABELS } from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { validateGoalsStep } from '@/features/onboarding/validation';

export default function OnboardingGoalsScreen() {
  const router = useRouter();
  const { draft, toggleGoal } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    const validationError = validateGoalsStep(draft.goals);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    router.push('/interests');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={4} />
      <BrandSectionHeader title="Your goals" subtitle="Choose everything that applies." />

      <View style={styles.chips}>
        {GOALS.map((goal) => (
          <BrandChip
            key={goal}
            label={GOAL_LABELS[goal]}
            selected={draft.goals.includes(goal)}
            onPress={() => toggleGoal(goal)}
          />
        ))}
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <BrandButton label="Continue" onPress={handleContinue} />
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});

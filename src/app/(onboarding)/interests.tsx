import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandChip } from '@/components/brand/BrandChip';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { TRAINING_INTERESTS, TRAINING_INTEREST_LABELS } from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { validateInterestsStep } from '@/features/onboarding/validation';

export default function OnboardingInterestsScreen() {
  const router = useRouter();
  const { draft, toggleInterest } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    const validationError = validateInterestsStep(draft.trainingInterests);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    router.push('/vibe');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={5} />
      <BrandSectionHeader title="Training interests" subtitle="Choose everything that applies." />

      <View style={styles.chips}>
        {TRAINING_INTERESTS.map((interest) => (
          <BrandChip
            key={interest}
            label={TRAINING_INTEREST_LABELS[interest]}
            selected={draft.trainingInterests.includes(interest)}
            onPress={() => toggleInterest(interest)}
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

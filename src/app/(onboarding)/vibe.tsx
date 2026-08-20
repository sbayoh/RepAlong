import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandChip } from '@/components/brand/BrandChip';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { MAX_TRAINING_VIBES, TRAINING_VIBES, TRAINING_VIBE_LABELS, type TrainingVibe } from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { validateVibeStep } from '@/features/onboarding/validation';

export default function OnboardingVibeScreen() {
  const router = useRouter();
  const { draft, toggleVibe } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  function handleToggle(vibe: TrainingVibe) {
    const isSelected = draft.trainingVibes.includes(vibe);
    if (!isSelected && draft.trainingVibes.length >= MAX_TRAINING_VIBES) {
      setError(`Choose up to ${MAX_TRAINING_VIBES} training vibes.`);
      return;
    }
    setError(null);
    toggleVibe(vibe);
  }

  function handleContinue() {
    const validationError = validateVibeStep(draft.trainingVibes);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    router.push('/hosting');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={6} />
      <BrandSectionHeader title="Training vibe" subtitle={`Choose 1–${MAX_TRAINING_VIBES} that fit how you like to train.`} />

      <View style={styles.chips}>
        {TRAINING_VIBES.map((vibe) => (
          <BrandChip
            key={vibe}
            label={TRAINING_VIBE_LABELS[vibe]}
            selected={draft.trainingVibes.includes(vibe)}
            onPress={() => handleToggle(vibe)}
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

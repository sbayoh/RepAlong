import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { ThemedText } from '@/components/themed-text';
import {
  EXPERIENCE_LEVELS,
  EXPERIENCE_LEVEL_DESCRIPTIONS,
  EXPERIENCE_LEVEL_LABELS,
  type ExperienceLevel,
} from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { validateExperienceStep } from '@/features/onboarding/validation';

export default function OnboardingExperienceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { draft, setExperienceLevel } = useOnboarding();

  const [selected, setSelected] = useState<ExperienceLevel | null>(draft.experienceLevel);
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    const validationError = validateExperienceStep(selected);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setExperienceLevel(selected!);
    router.push('/goals');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={3} />
      <BrandSectionHeader title="Your experience" subtitle="This isn't certification or authority — just a starting point." />

      <View style={styles.options}>
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = selected === level;
          return (
            <Pressable
              key={level}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelected(level)}>
              <BrandCard
                style={[
                  styles.option,
                  isSelected && { borderColor: theme.brandPrimary, backgroundColor: theme.brandPrimarySoft },
                ]}>
                <ThemedText type="bodyLarge" themeColor={isSelected ? 'brandPrimary' : 'textPrimary'}>
                  {EXPERIENCE_LEVEL_LABELS[level]}
                </ThemedText>
                <ThemedText type="bodySmall" themeColor="textSecondary">
                  {EXPERIENCE_LEVEL_DESCRIPTIONS[level]}
                </ThemedText>
              </BrandCard>
            </Pressable>
          );
        })}
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
  options: {
    gap: Spacing.three,
  },
  option: {
    gap: Spacing.one,
  },
});

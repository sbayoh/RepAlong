import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { Spacing } from '@/constants/theme';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

export default function OnboardingHostingScreen() {
  const router = useRouter();
  const { draft, setInterestedInHosting } = useOnboarding();
  const [selected, setSelected] = useState<boolean | null>(draft.interestedInHosting);

  function handleContinue() {
    if (selected === null) return;
    setInterestedInHosting(selected);
    router.push('/review');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={7} />
      <BrandSectionHeader
        title="Would you be interested in letting others train alongside you?"
        subtitle="You don't need to be a personal trainer. Hosting on RepAlong means sharing workouts you were already planning to do. Host requirements and session setup come later."
      />

      <BrandCard style={styles.options}>
        <HostingOption
          label="Yes, I'm interested"
          selected={selected === true}
          onPress={() => setSelected(true)}
        />
        <HostingOption
          label="Maybe later"
          selected={selected === false}
          onPress={() => setSelected(false)}
        />
      </BrandCard>

      <BrandButton label="Continue" onPress={handleContinue} disabled={selected === null} />
    </BrandScreen>
  );
}

function HostingOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return <BrandButton label={label} variant={selected ? 'primary' : 'secondary'} onPress={onPress} />;
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  options: {
    gap: Spacing.three,
  },
});

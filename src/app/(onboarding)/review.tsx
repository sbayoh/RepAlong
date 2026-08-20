import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandAvatar } from '@/components/brand/BrandAvatar';
import { BrandButton } from '@/components/brand/BrandButton';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandChip } from '@/components/brand/BrandChip';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { ThemedText } from '@/components/themed-text';
import {
  EXPERIENCE_LEVEL_LABELS,
  GOAL_LABELS,
  TRAINING_INTEREST_LABELS,
  TRAINING_VIBE_LABELS,
} from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

export default function OnboardingReviewScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuthSession();
  const { draft, isSubmitting, submitError, finishOnboarding } = useOnboarding();

  async function handleFinish() {
    const succeeded = await finishOnboarding();
    if (succeeded) {
      await refreshProfile();
      router.replace('/');
    }
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={8} />
      <BrandSectionHeader title="Review your profile" subtitle="You can always update this later." />

      <BrandCard style={styles.identityCard}>
        <BrandAvatar name={draft.displayName || 'RepAlong Member'} size="lg" />
        <View style={styles.identityText}>
          <ThemedText type="title">{draft.displayName || 'RepAlong Member'}</ThemedText>
          {draft.bio ? (
            <ThemedText type="bodySmall" themeColor="textSecondary">
              {draft.bio}
            </ThemedText>
          ) : null}
        </View>
      </BrandCard>

      <ReviewSection title="Experience">
        <ThemedText type="body">
          {draft.experienceLevel ? EXPERIENCE_LEVEL_LABELS[draft.experienceLevel] : '—'}
        </ThemedText>
      </ReviewSection>

      <ReviewSection title="Goals">
        <ChipList labels={draft.goals.map((goal) => GOAL_LABELS[goal])} />
      </ReviewSection>

      <ReviewSection title="Training interests">
        <ChipList labels={draft.trainingInterests.map((interest) => TRAINING_INTEREST_LABELS[interest])} />
      </ReviewSection>

      <ReviewSection title="Training vibe">
        <ChipList labels={draft.trainingVibes.map((vibe) => TRAINING_VIBE_LABELS[vibe])} />
      </ReviewSection>

      <ReviewSection title="Hosting">
        <ThemedText type="body">
          {draft.interestedInHosting ? "Yes, I'm interested" : 'Maybe later'}
        </ThemedText>
      </ReviewSection>

      {submitError ? <ErrorBanner message={submitError} /> : null}

      <BrandButton label="Finish setup" onPress={handleFinish} loading={isSubmitting} />
    </BrandScreen>
  );
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="label" themeColor="textSecondary">
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

function ChipList({ labels }: { labels: string[] }) {
  if (labels.length === 0) {
    return (
      <ThemedText type="body" themeColor="textMuted">
        None selected
      </ThemedText>
    );
  }
  return (
    <View style={styles.chips}>
      {labels.map((label) => (
        <BrandChip key={label} label={label} selected disabled />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  identityText: {
    flex: 1,
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});

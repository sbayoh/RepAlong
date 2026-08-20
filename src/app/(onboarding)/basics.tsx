import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { BrandTextField } from '@/components/brand/BrandTextField';
import { Spacing } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { OnboardingStepHeader } from '@/features/onboarding/components/OnboardingStepHeader';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { validateBasicsStep } from '@/features/onboarding/validation';

export default function OnboardingBasicsScreen() {
  const router = useRouter();
  const { draft, setBasics } = useOnboarding();

  const [firstName, setFirstName] = useState(draft.firstName);
  const [lastName, setLastName] = useState(draft.lastName);
  const [displayName, setDisplayName] = useState(draft.displayName);
  const [bio, setBio] = useState(draft.bio);
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    const validationError = validateBasicsStep({ firstName, lastName, displayName, bio });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setBasics({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim(),
      bio: bio.trim(),
    });
    router.push('/experience');
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <OnboardingStepHeader step={2} />
      <BrandSectionHeader title="About you" subtitle="This helps other RepAlong members recognize you." />

      <View style={styles.fields}>
        <BrandTextField
          label="First name"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          value={firstName}
          onChangeText={setFirstName}
        />
        <BrandTextField
          label="Last name"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          value={lastName}
          onChangeText={setLastName}
        />
        <BrandTextField
          label="Display name"
          helperText="What other members will see."
          autoCapitalize="words"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <BrandTextField
          label="Bio"
          helperText="Optional — a short intro."
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />
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
  fields: {
    gap: Spacing.three,
  },
});

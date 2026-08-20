import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { BrandTextField } from '@/components/brand/BrandTextField';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { Spacing } from '@/constants/theme';
import { ProfileSetupError, useAuthSession } from '@/features/auth/AuthContext';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { MIN_PASSWORD_LENGTH, validateSignUpForm } from '@/features/auth/validation';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuthSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (isSubmitting) return;

    const validationError = validateSignUpForm({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signUp({ firstName, lastName, email, password });
      router.replace('/');
    } catch (err) {
      if (err instanceof ProfileSetupError) {
        // Auth succeeded — the user is signed in and (app) will pick them
        // up; the signed-in screen surfaces the retry affordance.
        router.replace('/');
        return;
      }
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <RepAlongMark variant="symbol" size="md" />
      <BrandSectionHeader title="Create account" subtitle="Join RepAlong and find someone to train with." />

      <View style={styles.fields}>
        <BrandTextField
          label="First name"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          value={firstName}
          onChangeText={setFirstName}
          editable={!isSubmitting}
        />
        <BrandTextField
          label="Last name"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          value={lastName}
          onChangeText={setLastName}
          editable={!isSubmitting}
        />
        <BrandTextField
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!isSubmitting}
        />
        <BrandTextField
          label="Password"
          helperText={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
        />
        <BrandTextField
          label="Confirm password"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!isSubmitting}
        />
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <BrandButton label="Create account" onPress={handleSubmit} loading={isSubmitting} />
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: Spacing.three,
  },
  fields: {
    gap: Spacing.three,
  },
});

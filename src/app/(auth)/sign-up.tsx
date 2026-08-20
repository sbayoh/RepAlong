import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ProfileSetupError, useAuthSession } from '@/features/auth/AuthContext';
import { AuthButton } from '@/features/auth/components/AuthButton';
import { AuthTextField } from '@/features/auth/components/AuthTextField';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { validateSignUpForm } from '@/features/auth/validation';

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', default: undefined })}>
      <ThemedView style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={styles.heading}>
              Create account
            </ThemedText>

            <AuthTextField
              label="First name"
              autoCapitalize="words"
              autoComplete="given-name"
              textContentType="givenName"
              value={firstName}
              onChangeText={setFirstName}
              editable={!isSubmitting}
            />
            <AuthTextField
              label="Last name"
              autoCapitalize="words"
              autoComplete="family-name"
              textContentType="familyName"
              value={lastName}
              onChangeText={setLastName}
              editable={!isSubmitting}
            />
            <AuthTextField
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitting}
            />
            <AuthTextField
              label="Password"
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              value={password}
              onChangeText={setPassword}
              editable={!isSubmitting}
            />
            <AuthTextField
              label="Confirm password"
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isSubmitting}
            />

            {error ? <ErrorBanner message={error} /> : null}

            <AuthButton label="Create account" onPress={handleSubmit} loading={isSubmitting} />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    marginBottom: Spacing.two,
  },
});

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { BrandTextField } from '@/components/brand/BrandTextField';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { validateSignInForm } from '@/features/auth/validation';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuthSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (isSubmitting) return;

    const validationError = validateSignInForm({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <RepAlongMark variant="symbol" size="md" />
      <BrandSectionHeader title="Sign in" subtitle="Welcome back — pick up where you left off." />

      <View style={styles.fields}>
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
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
        />
        <ThemedText
          type="bodySmall"
          themeColor="brandPrimary"
          style={styles.forgotLink}
          onPress={() => router.push('/forgot-password')}
          accessibilityRole="link">
          Forgot password?
        </ThemedText>
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <BrandButton label="Sign in" onPress={handleSubmit} loading={isSubmitting} />
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
  forgotLink: {
    alignSelf: 'flex-end',
  },
});

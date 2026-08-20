import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandEmptyState } from '@/components/brand/BrandEmptyState';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { BrandTextField } from '@/components/brand/BrandTextField';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';
import { validateForgotPasswordForm } from '@/features/auth/validation';

/** Cooldown between reset-email sends, so "Send again" can't be used to spam the address. */
const RESEND_COOLDOWN_SECONDS = 30;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuthSession();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    cooldownInterval.current = setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          if (cooldownInterval.current) clearInterval(cooldownInterval.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  async function handleSubmit() {
    if (isSubmitting || cooldown > 0) return;

    const validationError = validateForgotPasswordForm({ email });
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedEmail = email.trim();
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(trimmedEmail);
      setSentTo(trimmedEmail);
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <BrandScreen contentStyle={styles.content}>
        <RepAlongMark variant="symbol" size="md" />
        <BrandEmptyState glyph="✉" title="Check your email" message={`We sent a password reset link to\n${sentTo}`}>
          <View style={styles.successActions}>
            <BrandButton label="Back to sign in" onPress={() => router.replace('/sign-in')} />
            <BrandButton
              label={cooldown > 0 ? `Send again (${cooldown}s)` : 'Send again'}
              variant="secondary"
              disabled={cooldown > 0}
              loading={isSubmitting}
              onPress={handleSubmit}
            />
          </View>
        </BrandEmptyState>
      </BrandScreen>
    );
  }

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <RepAlongMark variant="symbol" size="md" />
      <BrandSectionHeader
        title="Forgot your password?"
        subtitle="Enter the email connected to your RepAlong account and we'll send you a password reset link."
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

      {error ? <ErrorBanner message={error} /> : null}

      <BrandButton label="Send reset link" onPress={handleSubmit} loading={isSubmitting} />
      <ThemedText
        type="bodySmall"
        themeColor="brandPrimary"
        style={styles.backLink}
        onPress={() => router.replace('/sign-in')}
        accessibilityRole="link">
        Back to sign in
      </ThemedText>
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: Spacing.three,
  },
  successActions: {
    width: '100%',
    gap: Spacing.two,
  },
  backLink: {
    textAlign: 'center',
  },
});

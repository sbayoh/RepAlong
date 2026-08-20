import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';
import { AuthButton } from '@/features/auth/components/AuthButton';
import { ErrorBanner } from '@/features/auth/components/ErrorBanner';

export default function SignedInFoundationScreen() {
  const { firebaseUser, profile, isProfileLoading, profileError, signOutSession, retryProfileSetup } =
    useAuthSession();

  const firstName = profile?.firstName || firebaseUser?.displayName?.split(' ')[0] || 'there';
  const showSetupNotice = !isProfileLoading && !profile;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.heading}>
            Welcome to RepAlong, {firstName}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Your account foundation is ready.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.emailPill}>
            <ThemedText type="small" themeColor="textSecondary">
              {firebaseUser?.email}
            </ThemedText>
          </ThemedView>

          {isProfileLoading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Setting up your profile…
            </ThemedText>
          ) : null}

          {showSetupNotice ? (
            <ThemedView style={styles.setupNotice}>
              <ErrorBanner message={profileError ?? 'Your profile setup is still finishing.'} />
              <AuthButton label="Retry profile setup" variant="secondary" onPress={retryProfileSetup} />
            </ThemedView>
          ) : null}
        </ThemedView>

        <AuthButton label="Sign out" variant="secondary" onPress={signOutSession} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'space-between',
    alignSelf: 'center',
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  content: {
    gap: Spacing.three,
  },
  heading: {
    fontSize: 28,
    lineHeight: 34,
  },
  emailPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  setupNotice: {
    gap: Spacing.two,
  },
});

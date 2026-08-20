import { StyleSheet, View } from 'react-native';

import { BrandBadge } from '@/components/brand/BrandBadge';
import { BrandButton } from '@/components/brand/BrandButton';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandErrorState } from '@/components/brand/BrandErrorState';
import { BrandLoadingState } from '@/components/brand/BrandLoadingState';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';

export default function SignedInFoundationScreen() {
  const { firebaseUser, profile, isProfileLoading, profileError, signOutSession, retryProfileSetup } =
    useAuthSession();

  const firstName = profile?.firstName || firebaseUser?.displayName?.split(' ')[0] || 'there';
  const showSetupNotice = !isProfileLoading && !profile;

  return (
    <BrandScreen contentStyle={styles.content}>
      <View style={styles.header}>
        <RepAlongMark variant="symbol" size="sm" />
        <BrandButton label="Sign out" variant="ghost" onPress={signOutSession} />
      </View>

      <View style={styles.body}>
        <ThemedText type="headline">Welcome to RepAlong, {firstName}</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          Your account foundation is ready. The full RepAlong experience is on its way.
        </ThemedText>

        <BrandCard style={styles.accountCard}>
          <View style={styles.accountRow}>
            <ThemedText type="bodySmall" themeColor="textSecondary">
              {firebaseUser?.email}
            </ThemedText>
            <BrandBadge
              label={showSetupNotice ? 'Setup pending' : 'Account active'}
              tone={showSetupNotice ? 'warning' : 'success'}
            />
          </View>

          {isProfileLoading ? <BrandLoadingState label="Setting up your profile…" /> : null}

          {showSetupNotice ? (
            <BrandErrorState
              message={profileError ?? 'Your profile setup is still finishing.'}
              onRetry={retryProfileSetup}
              retryLabel="Retry profile setup"
            />
          ) : null}
        </BrandCard>
      </View>
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    gap: Spacing.three,
  },
  accountCard: {
    gap: Spacing.three,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});

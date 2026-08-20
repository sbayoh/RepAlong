import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandAvatar } from '@/components/brand/BrandAvatar';
import { BrandBadge } from '@/components/brand/BrandBadge';
import { BrandButton } from '@/components/brand/BrandButton';
import { BrandCard } from '@/components/brand/BrandCard';
import { BrandChip } from '@/components/brand/BrandChip';
import { BrandErrorState } from '@/components/brand/BrandErrorState';
import { BrandLoadingState } from '@/components/brand/BrandLoadingState';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { ThemedText } from '@/components/themed-text';
import { EXPERIENCE_LEVEL_LABELS, GOAL_LABELS, TRAINING_INTEREST_LABELS } from '@/constants/onboarding';
import { Spacing } from '@/constants/theme';
import { useAuthSession } from '@/features/auth/AuthContext';
import { beginProfileRepair, getProfile } from '@/services/firebase';
import type { Profile } from '@/types/profile';

export default function HomeScreen() {
  const {
    firebaseUser,
    profile: accountProfile,
    isProfileLoading,
    profileError,
    signOutSession,
    retryProfileSetup,
    refreshProfile,
  } = useAuthSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null);
  // Distinguishes a transient read failure (network error, catch block below) from a
  // successful read that confirms `profiles/{uid}` genuinely doesn't exist — only the
  // latter is safe to offer "Rebuild profile" for (see beginProfileRepair's contract).
  const [isProfileConfirmedMissing, setIsProfileConfirmedMissing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoadingProfile(true);
    setProfileFetchError(null);
    try {
      const fetched = await getProfile(firebaseUser.uid);
      setProfile(fetched);
      setIsProfileConfirmedMissing(!fetched);
      if (!fetched) {
        setProfileFetchError("We couldn't find your profile details.");
      }
    } catch {
      setIsProfileConfirmedMissing(false);
      setProfileFetchError('Could not load your profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [firebaseUser]);

  const rebuildProfile = useCallback(async () => {
    if (!firebaseUser) return;
    setIsRepairing(true);
    try {
      const result = await beginProfileRepair(firebaseUser.uid);
      if (result.outcome === 'profile-exists') {
        // The repair transaction's own read found the doc after all — nothing to
        // reset, just re-fetch and render it.
        await loadProfile();
        return;
      }
      // onboardingCompleted is now false — refresh the users/{uid} state routing
      // reads, which naturally moves this screen out for (onboarding).
      await refreshProfile();
    } catch {
      setProfileFetchError('Could not rebuild your profile. Please try again.');
    } finally {
      setIsRepairing(false);
    }
  }, [firebaseUser, loadProfile, refreshProfile]);

  useEffect(() => {
    // Only the account foundation (`users/{uid}`) is guaranteed to exist here — this
    // screen only mounts once onboarding is complete or the account doc is still
    // missing/loading (see the routing guard in src/app/_layout.tsx). Inlined (rather
    // than calling `loadProfile()`) to match AuthContext's passive-fetch pattern.
    if (!firebaseUser) {
      return;
    }
    if (!accountProfile?.onboardingCompleted) {
      return;
    }

    let cancelled = false;
    // Guarded by the `cancelled` flag/cleanup below — same cancelable-fetch shape as
    // the passive profile-fetch effect in AuthContext.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingProfile(true);
    getProfile(firebaseUser.uid)
      .then((fetched) => {
        if (cancelled) return;
        setProfile(fetched);
        setIsProfileConfirmedMissing(!fetched);
        setProfileFetchError(fetched ? null : "We couldn't find your profile details.");
      })
      .catch(() => {
        if (cancelled) return;
        setIsProfileConfirmedMissing(false);
        setProfileFetchError('Could not load your profile. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, accountProfile?.onboardingCompleted]);

  const showAccountSetupNotice = !isProfileLoading && !accountProfile;
  // profiles/{uid} (`profile`) is the preferred display source once it's loaded — it's
  // the finalized onboarding identity. users/{uid} (`accountProfile`) is the fallback
  // while it's still loading or genuinely missing, then the Auth display name, then a
  // generic greeting.
  const firstName = profile?.firstName || accountProfile?.firstName || firebaseUser?.displayName?.split(' ')[0] || 'there';

  return (
    <BrandScreen scrollable contentStyle={styles.content}>
      <View style={styles.header}>
        <RepAlongMark variant="symbol" size="sm" />
        <BrandButton label="Sign out" variant="ghost" onPress={signOutSession} />
      </View>

      <View style={styles.body}>
        <ThemedText type="headline">Welcome back, {firstName}</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          RepAlong is getting ready for your next workout.
        </ThemedText>

        {isProfileLoading ? <BrandLoadingState label="Setting up your profile…" /> : null}

        {showAccountSetupNotice ? (
          <BrandCard style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <ThemedText type="bodySmall" themeColor="textSecondary">
                {firebaseUser?.email}
              </ThemedText>
              <BrandBadge label="Setup pending" tone="warning" />
            </View>
            <BrandErrorState
              message={profileError ?? 'Your profile setup is still finishing.'}
              onRetry={retryProfileSetup}
              retryLabel="Retry profile setup"
            />
          </BrandCard>
        ) : null}

        {accountProfile?.onboardingCompleted ? (
          <ProfileSummary
            profile={profile}
            isLoading={isLoadingProfile}
            error={profileFetchError}
            isConfirmedMissing={isProfileConfirmedMissing}
            isRepairing={isRepairing}
            onRetry={loadProfile}
            onRebuild={rebuildProfile}
          />
        ) : null}
      </View>
    </BrandScreen>
  );
}

function ProfileSummary({
  profile,
  isLoading,
  error,
  isConfirmedMissing,
  isRepairing,
  onRetry,
  onRebuild,
}: {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isConfirmedMissing: boolean;
  isRepairing: boolean;
  onRetry: () => void;
  onRebuild: () => void;
}) {
  if (isLoading) {
    return <BrandLoadingState label="Loading your profile…" />;
  }

  if (!profile) {
    // A confirmed-missing profile (a successful read found no document) can't be
    // fixed by retrying the same read again — offer to rebuild it instead, which
    // routes back into onboarding. A transient fetch failure gets the ordinary retry.
    if (isConfirmedMissing) {
      if (isRepairing) {
        return <BrandLoadingState label="Rebuilding your profile…" />;
      }
      return (
        <BrandErrorState
          message="Your profile information needs to be set up again."
          onRetry={onRebuild}
          retryLabel="Rebuild profile"
        />
      );
    }
    // Never crash, never fabricate the missing data — just offer a retry.
    return <BrandErrorState message={error ?? 'Your profile is unavailable.'} onRetry={onRetry} />;
  }

  const topGoals = profile.goals.slice(0, 3).map((goal) => GOAL_LABELS[goal]);
  const topInterests = profile.trainingInterests.slice(0, 3).map((interest) => TRAINING_INTEREST_LABELS[interest]);

  return (
    <BrandCard style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <BrandAvatar name={profile.displayName} size="md" />
        <View style={styles.summaryText}>
          <ThemedText type="bodyLarge">{profile.displayName}</ThemedText>
          <ThemedText type="bodySmall" themeColor="textSecondary">
            {EXPERIENCE_LEVEL_LABELS[profile.experienceLevel]}
          </ThemedText>
        </View>
      </View>

      {topGoals.length > 0 || topInterests.length > 0 ? (
        <View style={styles.chips}>
          {topGoals.map((label) => (
            <BrandChip key={`goal-${label}`} label={label} selected disabled />
          ))}
          {topInterests.map((label) => (
            <BrandChip key={`interest-${label}`} label={label} selected disabled />
          ))}
        </View>
      ) : null}
    </BrandCard>
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
  summaryCard: {
    gap: Spacing.three,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  summaryText: {
    gap: Spacing.half,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});

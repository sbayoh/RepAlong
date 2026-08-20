import type { User } from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  ensureUserProfile,
  fetchUserProfile,
  getAuthErrorMessage,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeToAuthChanges,
} from '@/services/firebase';
import type { UserProfile } from '@/types/user';

/**
 * Thrown by `signUp` specifically when Firebase Auth succeeded but the
 * Firestore profile document could not be created. Callers should treat this
 * as recoverable: the user IS signed in (do not tell them registration
 * failed outright) and can retry via `retryProfileSetup`.
 */
export class ProfileSetupError extends Error {
  constructor() {
    super(
      'Account created, but profile setup did not finish. You are signed in — please retry from the account screen.',
    );
    this.name = 'ProfileSetupError';
  }
}

type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  firebaseUser: User | null;
  isAuthLoading: boolean;
  profile: UserProfile | null;
  isProfileLoading: boolean;
  profileError: string | null;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signOutSession: () => Promise<void>;
  retryProfileSetup: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthSession(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuthSession must be used within an <AuthProvider />');
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Prevents the passive profile-fetch effect below from clobbering a
  // profile that signUp/retryProfileSetup are actively creating for this
  // same uid (ensureUserProfile is transaction-safe, but a plain read that
  // lands mid-transaction would still see "not found" and shouldn't win).
  const profileWriteInFlightUidRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }
    if (profileWriteInFlightUidRef.current === firebaseUser.uid) {
      return;
    }

    let cancelled = false;
    setIsProfileLoading(true);
    fetchUserProfile(firebaseUser.uid)
      .then((fetched) => {
        if (!cancelled) setProfile(fetched);
      })
      .catch(() => {
        if (!cancelled) setProfileError('Could not load your profile. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setIsProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  const signUp = useCallback(async ({ firstName, lastName, email, password }: SignUpInput) => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const displayName = [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ');

    let user: User;
    try {
      user = await signUpWithEmail({ email: email.trim(), password }, displayName);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }

    profileWriteInFlightUidRef.current = user.uid;
    try {
      const createdProfile = await ensureUserProfile(user, {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      });
      setProfile(createdProfile);
      setProfileError(null);
    } catch (error) {
      // Auth already succeeded — this is a recoverable partial failure, not
      // a failed registration. The user stays signed in; retryProfileSetup
      // (surfaced on the signed-in screen) can finish the job.
      if (__DEV__) {
        console.error('[auth] ensureUserProfile failed during signUp:', error);
      }
      setProfileError(
        'Account created, but profile setup did not finish. You are signed in — please retry from the account screen.',
      );
      throw new ProfileSetupError();
    } finally {
      profileWriteInFlightUidRef.current = null;
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    try {
      await signInWithEmail({ email: email.trim(), password });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const signOutSession = useCallback(async () => {
    await signOutUser();
    setProfile(null);
    setProfileError(null);
  }, []);

  const retryProfileSetup = useCallback(async () => {
    if (!firebaseUser) return;
    profileWriteInFlightUidRef.current = firebaseUser.uid;
    setIsProfileLoading(true);
    try {
      const restored = await ensureUserProfile(firebaseUser);
      setProfile(restored);
      setProfileError(null);
    } catch (error) {
      if (__DEV__) {
        console.error('[auth] ensureUserProfile failed during retryProfileSetup:', error);
      }
      setProfileError('Still could not set up your profile. Please try again.');
    } finally {
      profileWriteInFlightUidRef.current = null;
      setIsProfileLoading(false);
    }
  }, [firebaseUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      isAuthLoading,
      // Derived rather than reset via a setState-in-effect (avoids
      // cascading-render lint/perf pitfall): once firebaseUser goes null,
      // any stale `profile` state is simply hidden until the next sign-in
      // repopulates it via the effect above.
      profile: firebaseUser ? profile : null,
      isProfileLoading,
      profileError,
      signUp,
      signIn,
      signOutSession,
      retryProfileSetup,
    }),
    [
      firebaseUser,
      isAuthLoading,
      profile,
      isProfileLoading,
      profileError,
      signUp,
      signIn,
      signOutSession,
      retryProfileSetup,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

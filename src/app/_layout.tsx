import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AuthProvider, useAuthSession } from '@/features/auth/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  );
}

/**
 * Keeps the native splash screen up until the initial Auth hydration check AND (for a
 * signed-in user) the first `users/{uid}` profile fetch both resolve. Waiting on the
 * profile too — not just Auth — is what prevents a signed-in user from ever flashing
 * into `(app)` before we actually know `onboardingCompleted`, which would otherwise
 * route them into the wrong group for one render before correcting itself.
 */
function SplashScreenController() {
  const { isAuthLoading, firebaseUser, isProfileLoading } = useAuthSession();

  if (!isAuthLoading && (!firebaseUser || !isProfileLoading)) {
    SplashScreen.hide();
  }

  return null;
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { firebaseUser, profile } = useAuthSession();

  // `profile` is the private `users/{uid}` doc (src/types/user.ts), not the Phase 2A
  // `profiles/{uid}` document — `onboardingCompleted` lives here, so no extra Firestore
  // read is needed just to route. `profile === null` (doc missing/still loading) keeps
  // routing to `(app)`, which already owns the "profile setup didn't finish" retry UI
  // from Phase 1A — onboarding only applies once we know the account doc exists.
  const needsOnboarding = !!firebaseUser && !!profile && !profile.onboardingCompleted;
  const isOnboarded = !!firebaseUser && (!profile || profile.onboardingCompleted);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isOnboarded}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={needsOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>
        <Stack.Protected guard={!firebaseUser}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

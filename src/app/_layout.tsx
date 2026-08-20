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

/** Keeps the native splash screen up until the initial Auth hydration check resolves. */
function SplashScreenController() {
  const { isAuthLoading } = useAuthSession();

  if (!isAuthLoading) {
    SplashScreen.hide();
  }

  return null;
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { firebaseUser } = useAuthSession();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!firebaseUser}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!firebaseUser}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

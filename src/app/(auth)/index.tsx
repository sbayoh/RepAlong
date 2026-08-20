import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AuthButton } from '@/features/auth/components/AuthButton';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.hero}>
          <ThemedText type="title" style={styles.title}>
            RepAlong
          </ThemedText>
          <ThemedText type="subtitle" style={styles.tagline}>
            Find experience.{'\n'}Train together.
          </ThemedText>
        </ThemedView>

        {/* Plain onPress navigation, not <Link asChild>: wrapping AuthButton
            (a composite Pressable, not a raw host element) in Link's asChild
            makes RN Web's Pressable switch to its href-anchor rendering mode
            and silently drop all button styling (background/padding/etc). */}
        <ThemedView style={styles.actions}>
          <AuthButton
            label="Create account"
            variant="primary"
            onPress={() => router.push('/sign-up')}
          />
          <AuthButton
            label="Sign in"
            variant="secondary"
            onPress={() => router.push('/sign-in')}
          />
        </ThemedView>
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
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: Spacing.two,
  },
});

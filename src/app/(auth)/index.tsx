import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandButton } from '@/components/brand/BrandButton';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <BrandScreen>
      <View style={styles.markRow}>
        <RepAlongMark variant="full" size="lg" />
      </View>

      <View style={styles.hero}>
        <View style={[styles.shapes, styles.noPointerEvents]}>
          <View style={[styles.shapeLg, { backgroundColor: theme.brandPrimarySoft }]} />
          <View style={[styles.shapeMd, { backgroundColor: theme.accentSoft }]} />
          <View style={[styles.shapeSm, { backgroundColor: theme.brandSecondarySoft }]} />
        </View>

        <ThemedText type="display" style={styles.headline}>
          Don&rsquo;t train alone.
        </ThemedText>
        <ThemedText type="bodyLarge" themeColor="textSecondary" style={styles.tagline}>
          Find experience. Train together.
        </ThemedText>
      </View>

      {/* Plain onPress navigation, not <Link asChild>: wrapping BrandButton
          (a composite Pressable, not a raw host element) in Link's asChild
          makes RN Web's Pressable switch to its href-anchor rendering mode
          and silently drop all button styling (background/padding/etc). */}
      <View style={styles.actions}>
        <BrandButton label="Create account" variant="primary" onPress={() => router.push('/sign-up')} />
        <BrandButton label="Sign in" variant="secondary" onPress={() => router.push('/sign-in')} />
      </View>
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  markRow: {
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  shapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  shapeLg: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: Radii.pill,
    top: '2%',
  },
  shapeMd: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: Radii.xl,
    bottom: '3%',
    left: '4%',
  },
  shapeSm: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: Radii.pill,
    bottom: '1%',
    right: '2%',
  },
  headline: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    width: '100%',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
});

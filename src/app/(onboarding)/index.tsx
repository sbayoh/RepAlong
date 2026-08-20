import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandButton } from '@/components/brand/BrandButton';
import { BrandScreen } from '@/components/brand/BrandScreen';
import { BrandSectionHeader } from '@/components/brand/BrandSectionHeader';
import { RepAlongMark } from '@/components/brand/RepAlongMark';
import { Spacing } from '@/constants/theme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <BrandScreen contentStyle={styles.content}>
      <View style={styles.body}>
        <RepAlongMark variant="symbol" size="md" />
        <BrandSectionHeader
          title="Welcome to RepAlong"
          subtitle="Tell us a little about how you train so we can personalize your experience."
        />
      </View>

      <BrandButton label="Get started" onPress={() => router.push('/basics')} />
    </BrandScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: Spacing.five,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
  },
});

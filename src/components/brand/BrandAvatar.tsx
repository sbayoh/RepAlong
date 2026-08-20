import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandAvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
};

const DIMENSION = { sm: 32, md: 44, lg: 64 } as const;
const TYPE = { sm: 'caption', md: 'bodyLarge', lg: 'title' } as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function BrandAvatar({ name, size = 'md' }: BrandAvatarProps) {
  const theme = useTheme();
  const dimension = DIMENSION[size];

  return (
    <View
      style={[
        styles.avatar,
        { width: dimension, height: dimension, backgroundColor: theme.brandSecondarySoft },
      ]}
      accessibilityLabel={name}>
      <ThemedText type={TYPE[size]} themeColor="brandSecondary">
        {getInitials(name)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: Radii.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

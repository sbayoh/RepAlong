import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function BrandDivider({ style, ...rest }: ViewProps) {
  const theme = useTheme();

  return <View style={[styles.divider, { backgroundColor: theme.border }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});

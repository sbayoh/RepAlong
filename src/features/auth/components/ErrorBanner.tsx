import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <ThemedText type="small" themeColor="danger" style={styles.text} accessibilityRole="alert">
      {message}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

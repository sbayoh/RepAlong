import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ControlHeights, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BrandTextFieldProps = TextInputProps & {
  label: string;
  /** Inline validation/helper message shown under the field. Treated as an error when `error` is true. */
  helperText?: string;
  error?: boolean;
};

export function BrandTextField({
  label,
  helperText,
  error = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: BrandTextFieldProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? theme.danger : isFocused ? theme.brandPrimary : theme.border;

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled: rest.editable === false }}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            color: theme.textPrimary,
            backgroundColor: theme.backgroundElevated,
            borderColor,
          },
          style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {helperText ? (
        <ThemedText
          type="caption"
          themeColor={error ? 'danger' : 'textMuted'}
          accessibilityRole={error ? 'alert' : undefined}>
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    minHeight: ControlHeights.md,
    borderRadius: Radii.input,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
});

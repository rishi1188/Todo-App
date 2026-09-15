/**
 * components/AppTextInput.tsx
 *
 * Reusable styled input field (dark surface, rounded, subtle border)
 * used for email/password fields on the auth screens, and later for
 * task title/description fields.
 */

import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';

const AppTextInput: React.FC<TextInputProps> = props => (
  <TextInput
    placeholderTextColor={colors.textMuted}
    style={styles.input}
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    ...typography.body,
    marginBottom: spacing.md,
  },
});

export default AppTextInput;

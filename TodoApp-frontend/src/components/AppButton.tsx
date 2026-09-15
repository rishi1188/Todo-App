/**
 * components/AppButton.tsx
 *
 * A single reusable button so every screen shares the same look
 * (rounded corners, brand color, pressed state, loading spinner)
 * instead of re-implementing TouchableOpacity + styling everywhere.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary'; // secondary = outlined/ghost style
  style?: ViewStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
}) => {
  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
      style={[styles.base, isSecondary ? styles.secondary : styles.primary, style]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.textPrimary} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.textSecondary]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  textSecondary: {
    color: colors.primary,
  },
});

export default AppButton;

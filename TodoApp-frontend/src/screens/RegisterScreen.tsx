/**
 * screens/RegisterScreen.tsx
 *
 * Lets a new user create an account with email + password via Firebase
 * Authentication. Includes a client-side confirm-password check before
 * ever calling Firebase, so users get instant feedback on mismatches.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthError } from '../services/authService';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { colors, spacing, typography } from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      // RootNavigator swaps to AppStack automatically once `user` updates.
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start organizing your tasks</Text>

      <AppTextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <AppTextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <AppTextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton title="Sign Up" onPress={handleRegister} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
  linkWrap: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  link: {
    color: colors.primary,
    ...typography.body,
  },
});

export default RegisterScreen;

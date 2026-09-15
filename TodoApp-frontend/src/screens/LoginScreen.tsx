/**
 * screens/LoginScreen.tsx
 *
 * Lets an existing user log in with email + password via Firebase
 * Authentication (through useAuth() -> AuthContext -> authService).
 * On success, RootNavigator automatically swaps to AppStack because
 * the auth state listener updates `user`.
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // No manual navigation needed — RootNavigator reacts to the auth
      // state change and swaps to AppStack automatically.
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
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to see your tasks</Text>

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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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

export default LoginScreen;

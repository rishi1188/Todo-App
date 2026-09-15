/**
 * navigation/RootNavigator.tsx
 *
 * The single source of truth for "which stack is the user in right now".
 * - While Firebase is still checking for an existing session -> loading view
 * - No user -> AuthStack (Login/Register)
 * - Logged-in user -> AppStack (Task list, etc.)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { colors } from '../theme/colors';

const RootNavigator: React.FC = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;

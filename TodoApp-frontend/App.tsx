/**
 * App.tsx
 *
 * App entry point. Order matters here:
 * 1. GestureHandlerRootView must wrap everything (required by
 *    react-native-gesture-handler, which React Navigation depends on).
 * 2. AuthProvider makes auth state available to RootNavigator and
 *    every screen beneath it.
 * 3. RootNavigator decides Auth vs App stack based on that state.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

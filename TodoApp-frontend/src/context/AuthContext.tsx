/**
 * context/AuthContext.tsx
 *
 * Makes the current auth state (user, initializing) and auth actions
 * (login, register, logout) available anywhere in the app via
 * useContext, without prop-drilling. Uses React's built-in state
 * (useState/useEffect) — no Redux/Zustand, per the project requirements.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthContextValue, AuthUser } from '../types';
import {
  loginUser,
  registerUser,
  logoutUser,
  onAuthStateChangedListener,
} from '../services/authService';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  // `initializing` stays true until Firebase tells us whether a session
  // already exists, so we don't briefly flash the login screen for a
  // user who's actually still logged in.
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(authUser => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe; // clean up the listener on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const authUser = await loginUser(email, password);
    setUser(authUser);
  };

  const register = async (email: string, password: string) => {
    const authUser = await registerUser(email, password);
    setUser(authUser);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // useMemo avoids handing consumers a brand-new object (and therefore
  // causing unnecessary re-renders) on every render of the provider.
  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

/** Hook for consuming auth state/actions in any screen or component. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * services/authService.ts
 *
 * Updated to @react-native-firebase's modular API (v22+): functions are
 * imported individually and take the auth instance as their first
 * argument, rather than being called on a auth() namespace object.
 */

import { authInstance } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import { AuthUser } from '../types';

/** Converts a Firebase user object into our smaller, app-facing AuthUser type. */
const toAuthUser = (firebaseUser: any): AuthUser | null => {
  if (!firebaseUser) return null;
  return { uid: firebaseUser.uid, email: firebaseUser.email };
};

/** Registers a new user with email + password. Throws on failure (e.g. email already in use). */
export async function registerUser(email: string, password: string): Promise<AuthUser | null> {
  const credential = await createUserWithEmailAndPassword(authInstance, email.trim(), password);
  return toAuthUser(credential.user);
}

/** Logs in an existing user. Throws on failure (wrong password, no such user, etc.). */
export async function loginUser(email: string, password: string): Promise<AuthUser | null> {
  const credential = await signInWithEmailAndPassword(authInstance, email.trim(), password);
  return toAuthUser(credential.user);
}

/** Logs the current user out. */
export async function logoutUser(): Promise<void> {
  await signOut(authInstance);
}

/**
 * Subscribes to Firebase's auth state changes (login, logout, session
 * restored on app launch). Returns the unsubscribe function so callers
 * can clean up in a useEffect.
 */
export function onAuthStateChangedListener(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChanged(authInstance, firebaseUser => {
    callback(toAuthUser(firebaseUser));
  });
}

/**
 * Maps common Firebase Auth error codes to friendly messages for display
 * in the UI, instead of surfacing raw Firebase error strings to the user.
 */
export function getFriendlyAuthError(error: any): string {
  const code: string = error?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
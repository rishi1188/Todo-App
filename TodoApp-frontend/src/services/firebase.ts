/**
 * services/firebase.ts
 *
 * Newer @react-native-firebase versions use the same "modular" API
 * shape as the modern Firebase Web SDK — individual imported functions
 * plus an explicit auth instance, instead of the old auth() callable
 * namespace. This file creates that one shared instance so the rest of
 * the app doesn't need to call getAuth() repeatedly.
 *
 * No firebaseConfig object is needed here — native config still comes
 * from google-services.json / GoogleService-Info.plist, same as before.
 */

import { getAuth } from '@react-native-firebase/auth';

export const authInstance = getAuth();
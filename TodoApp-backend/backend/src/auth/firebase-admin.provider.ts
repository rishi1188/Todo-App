/**
 * auth/firebase-admin.provider.ts
 *
 * Initializes the Firebase Admin SDK exactly once, using a service
 * account key file. The path is resolved relative to the project root
 * (process.cwd()) rather than passed straight to require() — Node's
 * relative require() resolution is based on the location of the
 * *calling file*, which breaks once TypeScript compiles this into
 * dist/auth/firebase-admin.provider.js (a different folder than the
 * project root where the JSON key actually lives).
 *
 * FIREBASE_SERVICE_ACCOUNT_PATH should point to the JSON key file you
 * download from Firebase Console > Project Settings > Service Accounts.
 * Never commit that file — keep it out of git via .gitignore.
 */

import { initializeApp, cert, App } from 'firebase-admin/app';
import * as path from 'path';
import * as fs from 'fs';

let firebaseApp: App | undefined;

export function getFirebaseAdmin(): App {
  if (!firebaseApp) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (!serviceAccountPath) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_PATH is not set. Add it to your .env file.',
      );
    }
    const absolutePath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(process.cwd(), serviceAccountPath);

    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));

    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return firebaseApp;
}
/**
 * auth/auth.module.ts
 *
 * Packages the Firebase auth guard so other modules (TasksModule) can
 * import AuthModule and use FirebaseAuthGuard via Nest's DI, rather
 * than instantiating it manually.
 */

import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthModule {}

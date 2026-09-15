/**
 * auth/firebase-auth.guard.ts
 *
 * Protects routes by requiring a valid Firebase ID token in the
 * `Authorization: Bearer <token>` header. On success, attaches the
 * decoded token (uid, email) to `request.user` so controllers/services
 * can scope data to the calling user. On failure, throws 401.
 *
 * Apply with @UseGuards(FirebaseAuthGuard) on a controller or route.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { getFirebaseAdmin } from './firebase-admin.provider';
import { getAuth } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends Request {
  user?: { uid: string; email: string | null };
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    try {
      const decoded = await getAuth(getFirebaseAdmin()).verifyIdToken(token);
      request.user = { uid: decoded.uid, email: decoded.email ?? null };
      return true;
        } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private extractToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return null;
    return header.substring('Bearer '.length);
  }
}

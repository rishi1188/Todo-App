/**
 * auth/decorators/current-user.decorator.ts
 *
 * Lets controller methods grab the authenticated user with a clean
 * `@CurrentUser() user: { uid: string; email: string | null }` param,
 * instead of reaching into the raw request object every time.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../firebase-auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from '../application/ports/token-issuer.port';
import { Role } from '../domain/value-objects/role.vo';

/**
 * Reads the @Roles(...) metadata set by the Roles decorator. If the
 * authenticated user's role is not in the list, returns 403.
 *
 * Note: ADMIN is implicitly allowed for any role — admins are operators
 * and can do anything a normal role can.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }
    if (user.role === Role.ADMIN || required.includes(user.role)) {
      return true;
    }
    throw new ForbiddenException(
      `Required role: ${required.join(' or ')}; have: ${user.role}`,
    );
  }
}
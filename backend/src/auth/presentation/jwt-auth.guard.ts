import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenIssuer } from '../application/ports/token-issuer.port';
import { JwtPayload } from '../application/ports/token-issuer.port';

/**
 * Validates the Authorization: Bearer <token> header. On success, the
 * payload is attached to the request as `request.user`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenIssuer) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = header.slice('Bearer '.length).trim();
    const payload: JwtPayload = this.tokens.verify(token);
    (request as Request & { user?: JwtPayload }).user = payload;
    return true;
  }
}
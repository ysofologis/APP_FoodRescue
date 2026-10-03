import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  TokenIssuer,
} from '../../application/ports/token-issuer.port';

/**
 * Adapter implementing TokenIssuer via @nestjs/jwt. Secret and expiry
 * come from the NestJS ConfigService; defaults are documented in the
 * app.config.ts file.
 */
@Injectable()
export class JwtTokenIssuer extends TokenIssuer {
  constructor(private readonly jwt: JwtService) {
    super();
  }

  sign(payload: JwtPayload): string {
    return this.jwt.sign(payload);
  }

  verify(token: string): JwtPayload {
    try {
      return this.jwt.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
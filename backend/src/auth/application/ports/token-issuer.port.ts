import { Role } from '../../domain/value-objects/role.vo';

/**
 * JWT contract: a token carries the subject (account id), the role,
 * and the linkedId (the donor / recipient / verifier id the account
 * acts on behalf of).
 */
export interface JwtPayload {
  sub: string;
  role: Role;
  linkedId: string;
  email: string;
}

export abstract class TokenIssuer {
  abstract sign(payload: JwtPayload): string;
  abstract verify(token: string): JwtPayload;
}
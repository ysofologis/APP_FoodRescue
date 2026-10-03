import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AuthAccountAggregate } from './domain/aggregates/auth-account.aggregate';
import { AuthAccountRepository } from './domain/repositories/auth-account.repository';
import { Role } from './domain/value-objects/role.vo';

/**
 * Seed a default verifier + admin account on first boot so smoke tests
 * can log in. Idempotent — checks for existing accounts before creating.
 *
 * Default credentials (override via env if desired):
 *   admin@foodrescue.local / admin-pass-123
 *
 * The verifier account uses a synthetic linkedId — the auth layer
 * doesn't yet bridge to a real VerifierAggregate row; trust actions
 * that require a verifier check the role, not the linkedId.
 */
@Injectable()
export class AuthBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthBootstrap.name);

  constructor(private readonly accounts: AuthAccountRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@foodrescue.local';
    const adminPass = process.env.ADMIN_PASSWORD ?? 'admin-pass-123';

    const existing = await this.accounts.findByEmail(adminEmail);
    if (existing) {
      return;
    }

    const seedLinkedId = uuid();
    const admin = await AuthAccountAggregate.seed(
      adminEmail,
      adminPass,
      Role.ADMIN,
      seedLinkedId,
    );
    await this.accounts.save(admin);
    this.logger.log(
      `Seeded default admin account: ${adminEmail} (change the password via /auth/login or update ADMIN_PASSWORD env)`,
    );
  }
}
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Role } from '../value-objects/role.vo';

/**
 * Authentication account. Bound 1:1 to either a Donor or Recipient via
 * `linkedId` (which context it lives in is captured by `role`).
 * Verifier accounts use the linkedId of a VerifierAggregate.
 *
 * Verifiers and admins are seeded by the platform operator; donors and
 * recipients are created on first registration. Passwords are stored
 * as bcrypt hashes; the aggregate factory accepts a plaintext password
 * and hashes it.
 */
@Entity('auth_accounts')
export class AuthAccountAggregate {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 20 })
  role!: Role;

  @Column({ type: 'varchar', length: 36 })
  linkedId!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  static async create(
    email: string,
    plaintextPassword: string,
    role: Role,
    linkedId: string,
  ): Promise<AuthAccountAggregate> {
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!plaintextPassword || plaintextPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!linkedId) {
      throw new Error('linkedId is required');
    }

    const account = new AuthAccountAggregate();
    account.id = uuid();
    account.email = email.toLowerCase();
    account.passwordHash = await bcrypt.hash(plaintextPassword, 10);
    account.role = role;
    account.linkedId = linkedId;
    account.active = true;
    account.createdAt = new Date();
    return account;
  }

  /**
   * Seed an admin/verifier account with a known password — bypasses
   * length validation. Used only by the bootstrap script.
   */
  static async seed(
    email: string,
    plaintextPassword: string,
    role: Role,
    linkedId: string,
  ): Promise<AuthAccountAggregate> {
    const account = new AuthAccountAggregate();
    account.id = uuid();
    account.email = email.toLowerCase();
    account.passwordHash = await bcrypt.hash(plaintextPassword, 10);
    account.role = role;
    account.linkedId = linkedId;
    account.active = true;
    account.createdAt = new Date();
    return account;
  }

  async verifyPassword(plaintext: string): Promise<boolean> {
    if (!this.active) return false;
    return bcrypt.compare(plaintext, this.passwordHash);
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }
}
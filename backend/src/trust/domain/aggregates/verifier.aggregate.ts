import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { VerificationCompletedEvent } from '../events/verification-completed.event';

@Entity('verifiers')
export class VerifierAggregate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  role: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'simple-json', default: [] })
  permissions: string[];

  @OneToMany(() => VerifierAuditEntry, (entry) => entry.verifierId)
  auditEntries: VerifierAuditEntry[];

  static create(
    name: string,
    role: string,
    permissions: string[] = [],
  ): [VerifierAggregate, any] {
    const verifier = new VerifierAggregate();
    verifier.id = uuid();
    verifier.name = name;
    verifier.role = role;
    verifier.active = true;
    verifier.permissions = permissions;

    return [verifier, { type: 'verifier.created', verifierId: verifier.id }];
  }

  deactivate(): void {
    this.active = false;
  }

  activate(): void {
    this.active = true;
  }

  addPermission(permission: string): void {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: string): void {
    this.permissions = this.permissions.filter((p) => p !== permission);
  }

  /**
   * Records a verification decision against an organization in another context.
   * The verifier's audit log is the source of truth for the trust context;
   * the target organization's status change is signaled by the returned
   * domain event and handled by a downstream subscriber.
   */
  recordVerification(
    organizationId: string,
    organizationType: 'DONOR' | 'RECIPIENT',
    verified: boolean,
    notes?: string,
  ): [VerifierAggregate, VerificationCompletedEvent] {
    if (!this.active) {
      throw new Error('Verifier is not active');
    }
    const event = new VerificationCompletedEvent(
      this.id,
      organizationId,
      organizationType,
      verified,
    );
    // Notes are logged externally via the audit entry write; the aggregate
    // carries the decision only.
    void notes;
    return [this, event];
  }
}

@Entity('verifier_audit')
export class VerifierAuditEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 'uuid' })
  verifierId: string;

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ type: 'varchar', length: 500 })
  entityType: string;

  @Column({ type: 'varchar', length: 'uuid' })
  entityId: string;

  @Column({ type: 'timestamp' })
  performedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  performedBy?: string;
}

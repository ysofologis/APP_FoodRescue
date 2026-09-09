import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

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

  @OneToMany(() => VerifierAuditEntry, (entry) => entry.verifier)
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

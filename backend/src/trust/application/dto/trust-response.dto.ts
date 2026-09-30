import { Exclude, Expose } from 'class-transformer';
import { VerifierAggregate, VerifierAuditEntry } from '../../domain/aggregates/verifier.aggregate';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';

@Exclude()
export class VerifierResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  role!: string;

  @Expose()
  active!: boolean;

  @Expose()
  permissions!: string[];

  static fromAggregate(v: VerifierAggregate): VerifierResponseDto {
    const dto = new VerifierResponseDto();
    dto.id = v.id;
    dto.name = v.name;
    dto.role = v.role;
    dto.active = v.active;
    dto.permissions = v.permissions ?? [];
    return dto;
  }
}

@Exclude()
export class DisputeResponseDto {
  @Expose()
  id!: string;

  @Expose()
  listingId!: string;

  @Expose()
  openedBy!: string;

  @Expose()
  reason!: string;

  @Expose()
  status!: string;

  @Expose()
  resolution?: string;

  @Expose()
  resolvedBy?: string;

  @Expose()
  openedAt!: Date;

  @Expose()
  resolvedAt?: Date;

  static fromAggregate(d: DisputeAggregate): DisputeResponseDto {
    const dto = new DisputeResponseDto();
    dto.id = d.id;
    dto.listingId = d.listingId;
    dto.openedBy = d.openedBy;
    dto.reason = d.reason;
    dto.status = d.status;
    dto.resolution = d.resolution;
    dto.resolvedBy = d.resolvedBy;
    dto.openedAt = d.openedAt;
    dto.resolvedAt = d.resolvedAt;
    return dto;
  }
}

@Exclude()
export class VerifierAuditEntryResponseDto {
  @Expose()
  id!: string;

  @Expose()
  verifierId!: string;

  @Expose()
  action!: string;

  @Expose()
  entityType!: string;

  @Expose()
  entityId!: string;

  @Expose()
  performedAt!: Date;

  @Expose()
  notes?: string;

  @Expose()
  performedBy?: string;

  static fromAggregate(e: VerifierAuditEntry): VerifierAuditEntryResponseDto {
    const dto = new VerifierAuditEntryResponseDto();
    dto.id = e.id;
    dto.verifierId = e.verifierId;
    dto.action = e.action;
    dto.entityType = e.entityType;
    dto.entityId = e.entityId;
    dto.performedAt = e.performedAt;
    dto.notes = e.notes;
    dto.performedBy = e.performedBy;
    return dto;
  }
}
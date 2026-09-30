import {
  IsString,
  IsOptional,
  IsUUID,
  IsIn,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export const VERIFIABLE_ORG_TYPES = ['DONOR', 'RECIPIENT'] as const;
export type VerifiableOrgType = (typeof VERIFIABLE_ORG_TYPES)[number];

export class VerifyOrganizationDto {
  @IsUUID()
  verifierId!: string;

  @IsUUID()
  organizationId!: string;

  @IsIn(VERIFIABLE_ORG_TYPES)
  organizationType!: VerifiableOrgType;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class ResolveDisputeDto {
  @IsUUID()
  disputeId!: string;

  @IsUUID()
  resolvedBy!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  resolution!: string;
}

export class BlacklistOrganizationDto {
  @IsUUID()
  organizationId!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;
}

export class CreateVerifierDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  role!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
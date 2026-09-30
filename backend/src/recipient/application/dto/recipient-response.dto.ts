import { Exclude, Expose } from 'class-transformer';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';

@Exclude()
export class RecipientResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  orgType!: string;

  @Expose()
  contactEmail!: string;

  @Expose()
  contactPhone?: string;

  @Expose()
  address?: string;

  @Expose()
  status!: string;

  @Expose()
  reliabilityScore!: number;

  @Expose()
  dietaryRestrictions!: string[];

  @Expose()
  preferredCategories!: string[];

  static fromAggregate(recipient: RecipientAggregate): RecipientResponseDto {
    const dto = new RecipientResponseDto();
    dto.id = recipient.id;
    dto.name = recipient.name;
    dto.orgType = recipient.orgType;
    dto.contactEmail = recipient.contactEmail;
    dto.contactPhone = recipient.contactPhone;
    dto.address = recipient.address;
    dto.status = recipient.status;
    dto.reliabilityScore = recipient.reliabilityScore;
    dto.dietaryRestrictions = recipient.dietaryRestrictions ?? [];
    dto.preferredCategories = recipient.preferredCategories ?? [];
    return dto;
  }
}
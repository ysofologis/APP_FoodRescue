import { Exclude, Expose } from 'class-transformer';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';

@Exclude()
export class DonorResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  contactEmail!: string;

  @Expose()
  contactPhone?: string;

  @Expose()
  address?: string;

  @Expose()
  businessLicense?: string;

  @Expose()
  status!: string;

  @Expose()
  createdAt?: Date;

  static fromAggregate(donor: DonorAggregate): DonorResponseDto {
    const dto = new DonorResponseDto();
    dto.id = donor.id;
    dto.name = donor.name;
    dto.contactEmail = donor.contactEmail;
    dto.contactPhone = donor.contactPhone;
    dto.address = donor.address;
    dto.businessLicense = donor.businessLicense;
    dto.status = donor.status;
    return dto;
  }
}
import { Exclude, Expose } from 'class-transformer';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';

@Exclude()
export class DistributionRunResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  driverId!: string;

  @Expose()
  listingIds!: string[];

  @Expose()
  scheduledPickup!: Date;

  @Expose()
  routeNotes?: string;

  @Expose()
  status!: string;

  @Expose()
  pickedUpAt?: Date;

  @Expose()
  deliveredAt?: Date;

  static fromAggregate(run: DistributionRunAggregate): DistributionRunResponseDto {
    const dto = new DistributionRunResponseDto();
    dto.id = run.id;
    dto.name = run.name;
    dto.driverId = run.driverId;
    dto.listingIds = run.listingIds ?? [];
    dto.scheduledPickup = run.scheduledPickup;
    dto.routeNotes = run.routeNotes;
    dto.status = run.status;
    dto.pickedUpAt = run.pickedUpAt;
    dto.deliveredAt = run.deliveredAt;
    return dto;
  }
}
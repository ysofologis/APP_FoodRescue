import { Expose, Type } from 'class-transformer';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';

@Expose()
export class ListingQuantityView {
  @Expose()
  value!: number;

  @Expose()
  unit!: string;
}

@Expose()
export class ListingResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  donorId!: string;

  @Expose()
  category!: string;

  @Expose()
  @Type(() => ListingQuantityView)
  quantity!: ListingQuantityView;

  @Expose()
  condition!: string;

  @Expose()
  storageRequirement!: string;

  @Expose()
  allergens?: string;

  @Expose()
  photoUrl?: string;

  @Expose()
  pickupLocation!: string;

  @Expose()
  pickupWindowStart!: Date;

  @Expose()
  pickupWindowEnd!: Date;

  @Expose()
  status!: string;

  @Expose()
  claimedBy?: string;

  @Expose()
  claimedAt?: Date;

  static fromAggregate(listing: FoodListing): ListingResponseDto {
    const dto = new ListingResponseDto();
    dto.id = listing.id;
    dto.title = listing.title;
    dto.description = listing.description;
    dto.donorId = listing.donorId;
    dto.category =
      typeof listing.category === 'string'
        ? listing.category
        : (listing.category as { valueOf(): string }).valueOf();
    dto.quantity = {
      value: (listing.quantity as { value: number }).value,
      unit: (listing.quantity as { unit: string }).unit,
    };
    dto.condition =
      typeof listing.condition === 'string'
        ? listing.condition
        : (listing.condition as { valueOf(): string }).valueOf();
    dto.storageRequirement =
      typeof listing.storageRequirement === 'string'
        ? listing.storageRequirement
        : (listing.storageRequirement as { valueOf(): string }).valueOf();
    dto.allergens = listing.allergens;
    dto.photoUrl = listing.photoUrl;
    dto.pickupLocation = listing.pickupLocation;
    dto.pickupWindowStart = listing.pickupWindowStart;
    dto.pickupWindowEnd = listing.pickupWindowEnd;
    dto.status = listing.status;
    dto.claimedBy = listing.claimedBy;
    dto.claimedAt = listing.claimedAt;
    return dto;
  }
}
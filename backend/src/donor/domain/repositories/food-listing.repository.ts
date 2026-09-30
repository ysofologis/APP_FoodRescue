import { FoodListing } from '../aggregates/food-listing.aggregate';

export abstract class FoodListingRepository {
  abstract save(listing: FoodListing): Promise<void>;
  abstract findById(id: string): Promise<FoodListing | null>;
  abstract findByDonorId(donorId: string): Promise<FoodListing[]>;
  abstract findAvailable(): Promise<FoodListing[]>;
  abstract findByStatus(status: string): Promise<FoodListing[]>;
}
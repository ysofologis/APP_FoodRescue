import { FoodListing } from '../aggregates/food-listing.aggregate';

export interface FoodListingRepository {
  save(listing: FoodListing): Promise<void>;
  findById(id: string): Promise<FoodListing | null>;
  findByDonorId(donorId: string): Promise<FoodListing[]>;
  findAvailable(): Promise<FoodListing[]>;
  findByStatus(status: string): Promise<FoodListing[]>;
}

import { FoodCategory } from '../value-objects/food-category.vo';
import { Quantity } from '../value-objects/quantity.vo';

export class FoodListingCreatedEvent {
  constructor(
    public readonly listingId: string,
    public readonly title: string,
    public readonly donorId: string,
    public readonly category: FoodCategory,
    public readonly quantity: Quantity,
  ) {}
}

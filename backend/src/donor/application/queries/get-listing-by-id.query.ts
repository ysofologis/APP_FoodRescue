import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';

export class GetListingByIdQuery {
  constructor(public readonly listingId: string) {}
}

@Injectable()
@QueryHandler(GetListingByIdQuery)
export class GetListingByIdQueryHandler
  implements IQueryHandler<GetListingByIdQuery, FoodListing | null>
{
  constructor(private readonly listings: FoodListingRepository) {}

  async execute(query: GetListingByIdQuery): Promise<FoodListing | null> {
    return this.listings.findById(query.listingId);
  }
}
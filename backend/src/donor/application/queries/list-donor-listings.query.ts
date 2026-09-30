import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';

export class ListDonorListingsQuery {
  constructor(public readonly donorId: string) {}
}

@Injectable()
@QueryHandler(ListDonorListingsQuery)
export class ListDonorListingsQueryHandler
  implements IQueryHandler<ListDonorListingsQuery, FoodListing[]>
{
  constructor(private readonly listings: FoodListingRepository) {}

  async execute(query: ListDonorListingsQuery): Promise<FoodListing[]> {
    return this.listings.findByDonorId(query.donorId);
  }
}
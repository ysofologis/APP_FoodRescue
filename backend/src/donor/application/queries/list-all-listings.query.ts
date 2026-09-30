import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';

/**
 * Listing for the marketplace / discover view. Pass `status` to filter;
 * omit to list all (admin use case).
 */
export class ListAllListingsQuery {
  constructor(public readonly status?: string) {}
}

@Injectable()
@QueryHandler(ListAllListingsQuery)
export class ListAllListingsQueryHandler
  implements IQueryHandler<ListAllListingsQuery, FoodListing[]>
{
  constructor(private readonly listings: FoodListingRepository) {}

  async execute(query: ListAllListingsQuery): Promise<FoodListing[]> {
    return query.status
      ? this.listings.findByStatus(query.status)
      : this.listings.findAvailable();
  }
}
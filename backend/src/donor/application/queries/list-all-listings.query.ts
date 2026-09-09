import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository as FoodListingRepoInterface } from '../../domain/repositories/food-listing.repository';

export class ListAllListingsQuery {
  constructor(public readonly status?: string) {}
}

@QueryHandler(ListAllListingsQuery)
export class ListAllListingsQueryHandler
  implements IQueryHandler<ListAllListingsQuery>
{
  constructor(
    @InjectRepository(FoodListing)
    private readonly listingRepo: Repository<FoodListing>,
  ) {}

  async execute(query: ListAllListingsQuery): Promise<FoodListing[]> {
    if (query.status) {
      return this.listingRepo.find({ where: { status: query.status } });
    }
    return this.listingRepo.find();
  }
}

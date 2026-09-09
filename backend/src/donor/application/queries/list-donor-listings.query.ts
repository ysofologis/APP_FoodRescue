import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';

export class ListDonorListingsQuery {
  constructor(public readonly donorId: string) {}
}

@QueryHandler(ListDonorListingsQuery)
export class ListDonorListingsQueryHandler
  implements IQueryHandler<ListDonorListingsQuery>
{
  constructor(
    @InjectRepository(FoodListing)
    private readonly listingRepo: Repository<FoodListing>,
  ) {}

  async execute(query: ListDonorListingsQuery): Promise<FoodListing[]> {
    return this.listingRepo.findByDonorId(query.donorId);
  }
}

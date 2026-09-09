import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository as FoodListingRepoInterface } from '../../domain/repositories/food-listing.repository';

export class GetListingByIdQuery {
  constructor(public readonly listingId: string) {}
}

@QueryHandler(GetListingByIdQuery)
export class GetListingByIdQueryHandler
  implements IQueryHandler<GetListingByIdQuery>
{
  constructor(
    @InjectRepository(FoodListing)
    private readonly listingRepo: Repository<FoodListing>,
  ) {}

  async execute(query: GetListingByIdQuery): Promise<FoodListing | null> {
    return this.listingRepo.findOne({ where: { id: query.listingId } });
  }
}

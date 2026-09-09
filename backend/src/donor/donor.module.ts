import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@typeorm/sqlite';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DonorAggregate } from './domain/aggregates/donor.aggregate';
import { FoodListing } from './domain/aggregates/food-listing.aggregate';
import { DonorRepository } from './infrastructure/repositories/donor.repository';
import { FoodListingRepository } from './infrastructure/repositories/food-listing.repository';
import { CreateListingCommandHandler } from './application/commands/create-listing.command';
import { ClaimListingCommandHandler } from './application/commands/claim-listing.command';
import { ListDonorListingsQueryHandler } from './application/queries/list-donor-listings.query';
import { DonorCreatedEvent } from './domain/events/donor-created.event';
import { FoodListingCreatedEvent } from './domain/events/food-listing-created.event';
import { FoodListingClaimedEvent } from './domain/events/food-listing-claimed.event';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonorAggregate, FoodListing]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    DonorRepository,
    FoodListingRepository,
    CreateListingCommandHandler,
    ClaimListingCommandHandler,
    ListDonorListingsQueryHandler,
  ],
  exports: [DonorRepository, FoodListingRepository],
})
export class DonorModule {}

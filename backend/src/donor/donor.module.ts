import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { DonorAggregate } from './domain/aggregates/donor.aggregate';
import { FoodListing } from './domain/aggregates/food-listing.aggregate';
import { DonorRepository } from './domain/repositories/donor.repository';
import { FoodListingRepository } from './domain/repositories/food-listing.repository';

import { DonorRepositoryImpl } from './infrastructure/repositories/donor.repository';
import { FoodListingRepositoryImpl } from './infrastructure/repositories/food-listing.repository';

import { RegisterDonorCommandHandler } from './application/commands/register-donor.command';
import { CreateListingCommandHandler } from './application/commands/create-listing.command';
import { ClaimListingCommandHandler } from './application/commands/claim-listing.command';

import { GetDonorByIdQueryHandler } from './application/queries/get-donor-by-id.query';
import { GetListingByIdQueryHandler } from './application/queries/get-listing-by-id.query';
import { ListDonorListingsQueryHandler } from './application/queries/list-donor-listings.query';
import { ListAllListingsQueryHandler } from './application/queries/list-all-listings.query';
import { GetDonorImpactQueryHandler } from './application/queries/get-donor-impact.query';
import { GetImpactDashboardQueryHandler } from './application/queries/get-impact-dashboard.query';
import { GetPublicImpactQueryHandler } from './application/queries/get-public-impact.query';
import { GetRecipientImpactQueryHandler } from './application/queries/get-recipient-impact.query';
import { GetRecipientByIdQueryHandler } from './application/queries/get-recipient-by-id.query';
import { GetDriverRunsQueryHandler } from './application/queries/get-driver-runs.query';
import { GetVerifiersQueryHandler } from './application/queries/get-verifiers.query';

import { DonorsController } from './presentation/donors.controller';

// ACL adapters — implementations live in their owning contexts.
import { AnalyticsImpactReadAdapter } from '../analytics/infrastructure/acl/donor-impact-read.adapter';
import { AnalyticsPublicImpactReadAdapter } from '../analytics/infrastructure/acl/public-impact-read.adapter';
import { AnalyticsRecipientImpactReadAdapter } from '../analytics/infrastructure/acl/recipient-impact-read.adapter';
import { RecipientContextLookupAdapter } from '../recipient/infrastructure/acl/recipient-lookup.adapter';
import { LogisticsDriverRunsReadAdapter } from '../logistics/infrastructure/acl/driver-runs-read.adapter';
import { TrustVerifiersReadAdapter } from '../trust/infrastructure/acl/verifiers-read.adapter';

// Port tokens (abstract classes) — bound to ACL implementations below.
import { ImpactReadPort } from './application/ports/impact-read.port';
import { PublicImpactReadPort } from './application/ports/public-impact-read.port';
import { RecipientImpactReadPort } from './application/ports/recipient-impact-read.port';
import { RecipientLookupPort } from './application/ports/recipient-lookup.port';
import { DriverRunsReadPort } from './application/ports/driver-runs-read.port';
import { VerifiersReadPort } from './application/ports/verifiers-read.port';

// Source modules — required so the cross-context adapters registered
// here can resolve their repository dependencies.
import { AnalyticsModule } from '../analytics/analytics.module';
import { RecipientModule } from '../recipient/recipient.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { TrustModule } from '../trust/trust.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonorAggregate, FoodListing]),
    CqrsModule,
    AnalyticsModule,
    RecipientModule,
    LogisticsModule,
    TrustModule,
  ],
  controllers: [DonorsController],
  providers: [
    // Bind abstract domain ports to concrete infrastructure classes
    { provide: DonorRepository, useClass: DonorRepositoryImpl },
    { provide: FoodListingRepository, useClass: FoodListingRepositoryImpl },

    // Real ACL adapters — bound to donor port tokens (abstract classes)
    { provide: ImpactReadPort, useClass: AnalyticsImpactReadAdapter },
    {
      provide: PublicImpactReadPort,
      useClass: AnalyticsPublicImpactReadAdapter,
    },
    {
      provide: RecipientImpactReadPort,
      useClass: AnalyticsRecipientImpactReadAdapter,
    },
    {
      provide: RecipientLookupPort,
      useClass: RecipientContextLookupAdapter,
    },
    { provide: DriverRunsReadPort, useClass: LogisticsDriverRunsReadAdapter },
    { provide: VerifiersReadPort, useClass: TrustVerifiersReadAdapter },

    // Commands
    RegisterDonorCommandHandler,
    CreateListingCommandHandler,
    ClaimListingCommandHandler,

    // Queries
    GetDonorByIdQueryHandler,
    GetListingByIdQueryHandler,
    ListDonorListingsQueryHandler,
    ListAllListingsQueryHandler,
    GetDonorImpactQueryHandler,
    GetImpactDashboardQueryHandler,
    GetPublicImpactQueryHandler,
    GetRecipientImpactQueryHandler,
    GetRecipientByIdQueryHandler,
    GetDriverRunsQueryHandler,
    GetVerifiersQueryHandler,
  ],
  exports: [DonorRepository, FoodListingRepository],
})
export class DonorModule {}
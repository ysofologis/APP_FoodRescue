import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { DonorAggregate } from './domain/aggregates/donor.aggregate';
import { FoodListing } from './domain/aggregates/food-listing.aggregate';
import { DonorRepository } from './infrastructure/repositories/donor.repository';
import { FoodListingRepository } from './infrastructure/repositories/food-listing.repository';

import { RegisterDonorCommandHandler } from './application/commands/register-donor.command';
import { CreateListingCommandHandler } from './application/commands/create-listing.command';
import { ClaimListingCommandHandler } from './application/commands/claim-listing.command';

import { DonorsController } from './presentation/donors.controller';

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

// ACL adapters — implementations live in their owning contexts and
// are imported here so we can bind them to the port tokens.
import { AnalyticsImpactReadAdapter } from '../analytics/infrastructure/acl/donor-impact-read.adapter';
import { AnalyticsPublicImpactReadAdapter } from '../analytics/infrastructure/acl/public-impact-read.adapter';
import { RecipientContextLookupAdapter } from '../recipient/infrastructure/acl/recipient-lookup.adapter';
import { LogisticsDriverRunsReadAdapter } from '../logistics/infrastructure/acl/driver-runs-read.adapter';
import { TrustVerifiersReadAdapter } from '../trust/infrastructure/acl/verifiers-read.adapter';

// ACL adapters we own internally (donor's read of donor-internal queries
// that map straight to our repository — no port needed).
import { StubImpactReadAdapter } from './infrastructure/acl/stub-impact-read.adapter';
import { StubPublicImpactReadAdapter } from './infrastructure/acl/stub-public-impact-read.adapter';
import { StubRecipientLookupAdapter } from './infrastructure/acl/stub-recipient-lookup.adapter';
import { StubDriverRunsReadAdapter } from './infrastructure/acl/stub-driver-runs-read.adapter';
import { StubVerifiersReadAdapter } from './infrastructure/acl/stub-verifiers-read.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonorAggregate, FoodListing]),
    CqrsModule,
  ],
  providers: [
    // Repositories (implement domain ports)
    DonorRepository,
    FoodListingRepository,

    // Real ACL adapters — bound to donor port tokens
    { provide: 'ImpactReadPort', useClass: AnalyticsImpactReadAdapter },
    {
      provide: 'PublicImpactReadPort',
      useClass: AnalyticsPublicImpactReadAdapter,
    },
    {
      provide: 'RecipientLookupPort',
      useClass: RecipientContextLookupAdapter,
    },
    { provide: 'DriverRunsReadPort', useClass: LogisticsDriverRunsReadAdapter },
    { provide: 'VerifiersReadPort', useClass: TrustVerifiersReadAdapter },

    // Stubs kept available for tests that want to inject failures without
    // touching real infrastructure. Not bound by default.
    StubImpactReadAdapter,
    StubPublicImpactReadAdapter,
    StubRecipientLookupAdapter,
    StubDriverRunsReadAdapter,
    StubVerifiersReadAdapter,

    // Controllers
    DonorsController,

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
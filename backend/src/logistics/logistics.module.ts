import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { DistributionRunAggregate } from './domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from './infrastructure/repositories/distribution-run.repository';
import { LogisticsDriverRunsReadAdapter } from './infrastructure/acl/driver-runs-read.adapter';
import { AssignDriverCommandHandler } from './application/commands/assign-driver.command';
import { ConfirmPickupCommandHandler } from './application/commands/confirm-pickup.command';
import { ConfirmDeliveryCommandHandler } from './application/commands/confirm-delivery.command';
import { CancelRunCommandHandler } from './application/commands/cancel-run.command';
import { CreateRunCommandHandler } from './application/commands/create-run.command';
import { ListDistributionRunsQueryHandler } from './application/queries/list-distribution-runs.query';
import { DistributionRunsController } from './presentation/distribution-runs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistributionRunAggregate]),
    CqrsModule,
  ],
  controllers: [DistributionRunsController],
  providers: [
    DistributionRunRepository,
    LogisticsDriverRunsReadAdapter,
    AssignDriverCommandHandler,
    ConfirmPickupCommandHandler,
    ConfirmDeliveryCommandHandler,
    CancelRunCommandHandler,
    CreateRunCommandHandler,
    ListDistributionRunsQueryHandler,
  ],
  exports: [DistributionRunRepository, LogisticsDriverRunsReadAdapter],
})
export class LogisticsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@typeorm/sqlite';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DistributionRunAggregate } from './domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from './infrastructure/repositories/distribution-run.repository';
import { AssignDriverCommandHandler } from './application/commands/assign-driver.command';
import { ListDistributionRunsQueryHandler } from './application/queries/list-distribution-runs.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistributionRunAggregate]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    DistributionRunRepository,
    AssignDriverCommandHandler,
    ListDistributionRunsQueryHandler,
  ],
  exports: [DistributionRunRepository],
})
export class LogisticsModule {}

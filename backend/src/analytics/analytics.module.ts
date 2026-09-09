import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@typeorm/sqlite';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ImpactMetricAggregate } from './domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository } from './infrastructure/repositories/impact-metric.repository';
import { RecordImpactCommandHandler } from './application/commands/record-impact.command';
import { GetImpactReportQueryHandler } from './application/queries/get-impact-report.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImpactMetricAggregate]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    ImpactMetricRepository,
    RecordImpactCommandHandler,
    GetImpactReportQueryHandler,
  ],
  exports: [ImpactMetricRepository],
})
export class AnalyticsModule {}

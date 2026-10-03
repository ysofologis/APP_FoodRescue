import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { ImpactMetricAggregate } from './domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository } from './domain/repositories/impact-metric.repository';
import { ImpactMetricRepositoryImpl } from './infrastructure/repositories/impact-metric.repository';
import { AnalyticsImpactReadAdapter } from './infrastructure/acl/donor-impact-read.adapter';
import { AnalyticsPublicImpactReadAdapter } from './infrastructure/acl/public-impact-read.adapter';
import { AnalyticsRecipientImpactReadAdapter } from './infrastructure/acl/recipient-impact-read.adapter';
import { RecordImpactCommandHandler } from './application/commands/record-impact.command';
import { GetImpactReportQueryHandler } from './application/queries/get-impact-report.query';
import { AnalyticsController } from './presentation/analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactMetricAggregate]), CqrsModule],
  providers: [
    { provide: ImpactMetricRepository, useClass: ImpactMetricRepositoryImpl },
    RecordImpactCommandHandler,
    GetImpactReportQueryHandler,
    // ACL adapters — implement donor's read ports
    AnalyticsImpactReadAdapter,
    AnalyticsPublicImpactReadAdapter,
    AnalyticsRecipientImpactReadAdapter,
  ],
  controllers: [AnalyticsController],
  exports: [
    ImpactMetricRepository,
    AnalyticsImpactReadAdapter,
    AnalyticsPublicImpactReadAdapter,
    AnalyticsRecipientImpactReadAdapter,
  ],
})
export class AnalyticsModule {}
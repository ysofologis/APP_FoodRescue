import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository } from '../../domain/repositories/impact-metric.repository';

export class GetImpactReportQuery {
  constructor(public readonly donorId?: string, public readonly recipientId?: string) {}
}

@Injectable()
@QueryHandler(GetImpactReportQuery)
export class GetImpactReportQueryHandler
  implements IQueryHandler<GetImpactReportQuery>
{
  constructor(private readonly metrics: ImpactMetricRepository) {}

  async execute(query: GetImpactReportQuery): Promise<{
    metrics: ImpactMetricAggregate[];
    aggregate: { totalMealsSaved: number; totalCo2Avoided: number; totalKgDelivered: number };
  }> {
    let metrics: ImpactMetricAggregate[];

    if (query.donorId) {
      metrics = await this.metrics.findByDonorId(query.donorId);
    } else if (query.recipientId) {
      metrics = await this.metrics.findByRecipientId(query.recipientId);
    } else {
      // No specific filter — return the global aggregate only.
      metrics = [];
    }

    const aggregate = await this.metrics.getAggregateMetrics();

    return { metrics, aggregate };
  }
}
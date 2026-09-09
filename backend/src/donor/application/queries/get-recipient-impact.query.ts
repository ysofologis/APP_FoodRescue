import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../analytics/domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../analytics/domain/repositories/impact-metric.repository';

export class GetRecipientImpactQuery {
  constructor(public readonly recipientId: string) {}
}

@QueryHandler(GetRecipientImpactQuery)
export class GetRecipientImpactQueryHandler
  implements IQueryHandler<GetRecipientImpactQuery>
{
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly metricRepo: Repository<ImpactMetricAggregate>,
  ) {}

  async execute(query: GetRecipientImpactQuery): Promise<{
    metrics: ImpactMetricAggregate[];
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
  }> {
    const metrics = await this.metricRepo.findByRecipientId(query.recipientId);
    const aggregate = await this.metricRepo.getAggregateMetrics();

    return {
      metrics,
      totalMealsSaved: aggregate.totalMealsSaved,
      totalCo2Avoided: aggregate.totalCo2Avoided,
      totalKgDelivered: aggregate.totalKgDelivered,
    };
  }
}

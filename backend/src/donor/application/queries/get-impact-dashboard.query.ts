import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../analytics/domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../analytics/domain/repositories/impact-metric.repository';

export class GetImpactDashboardQuery {
  constructor(public readonly donorId?: string) {}
}

@QueryHandler(GetImpactDashboardQuery)
export class GetImpactDashboardQueryHandler
  implements IQueryHandler<GetImpactDashboardQuery>
{
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly metricRepo: Repository<ImpactMetricAggregate>,
  ) {}

  async execute(query: GetImpactDashboardQuery): Promise<{
    metrics: ImpactMetricAggregate[];
    aggregate: { totalMealsSaved: number; totalCo2Avoided: number; totalKgDelivered: number };
  }> {
    let metrics: ImpactMetricAggregate[];

    if (query.donorId) {
      metrics = await this.metricRepo.find({ where: { donorId: query.donorId } });
    } else {
      metrics = await this.metricRepo.find();
    }

    const aggregate = await this.metricRepo.getAggregateMetrics();

    return { metrics, aggregate };
  }
}

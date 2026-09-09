import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../domain/repositories/impact-metric.repository';

export class GetImpactReportQuery {
  constructor(public readonly donorId?: string, public readonly recipientId?: string) {}
}

@QueryHandler(GetImpactReportQuery)
export class GetImpactReportQueryHandler
  implements IQueryHandler<GetImpactReportQuery>
{
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly metricRepo: Repository<ImpactMetricAggregate>,
  ) {}

  async execute(query: GetImpactReportQuery): Promise<{
    metrics: ImpactMetricAggregate[];
    aggregate: { totalMealsSaved: number; totalCo2Avoided: number; totalKgDelivered: number };
  }> {
    let metrics: ImpactMetricAggregate[];

    if (query.donorId) {
      metrics = await this.metricRepo.find({ where: { donorId: query.donorId } });
    } else if (query.recipientId) {
      metrics = await this.metricRepo.find({ where: { recipientId: query.recipientId } });
    } else {
      metrics = await this.metricRepo.find();
    }

    const aggregate = await this.metricRepo.getAggregateMetrics();

    return { metrics, aggregate };
  }
}

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../analytics/domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../analytics/domain/repositories/impact-metric.repository';

export class GetPublicImpactQuery {}

@QueryHandler(GetPublicImpactQuery)
export class GetPublicImpactQueryHandler
  implements IQueryHandler<GetPublicImpactQuery>
{
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly metricRepo: Repository<ImpactMetricAggregate>,
  ) {}

  async execute(): Promise<{
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
    topDonors: ImpactMetricAggregate[];
    topRecipients: ImpactMetricAggregate[];
  }> {
    const aggregate = await this.metricRepo.getAggregateMetrics();

    const topDonors = await this.metricRepo
      .createQueryBuilder('metric')
      .select('metric.donorId', 'donorId')
      .addSelect('SUM(metric.mealsSaved)', 'totalMeals')
      .groupBy('metric.donorId')
      .orderBy('totalMeals', 'DESC')
      .limit(10)
      .getRawMany();

    const topRecipients = await this.metricRepo
      .createQueryBuilder('metric')
      .select('metric.recipientId', 'recipientId')
      .addSelect('SUM(metric.mealsSaved)', 'totalMeals')
      .groupBy('metric.recipientId')
      .orderBy('totalMeals', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      ...aggregate,
      topDonors,
      topRecipients,
    };
  }
}

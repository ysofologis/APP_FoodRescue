import { ImpactMetricAggregate } from '../aggregates/impact-metric.aggregate';

export interface ImpactMetricRepository {
  save(metric: ImpactMetricAggregate): Promise<void>;
  findById(id: string): Promise<ImpactMetricAggregate | null>;
  findByDonorId(donorId: string): Promise<ImpactMetricAggregate[]>;
  findByRecipientId(recipientId: string): Promise<ImpactMetricAggregate[]>;
  getAggregateMetrics(): Promise<{
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
  }>;
}

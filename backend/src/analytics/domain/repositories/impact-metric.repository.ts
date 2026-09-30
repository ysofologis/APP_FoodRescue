import { ImpactMetricAggregate } from '../aggregates/impact-metric.aggregate';

/**
 * Abstract class (not interface) so NestJS DI can use it as a token.
 * TypeScript interfaces are erased at compile time; abstract classes
 * are not, so the runtime container can resolve them.
 *
 * Implementation: infrastructure/repositories/impact-metric.repository.ts
 */
export abstract class ImpactMetricRepository {
  abstract save(metric: ImpactMetricAggregate): Promise<void>;
  abstract findById(id: string): Promise<ImpactMetricAggregate | null>;
  abstract findByDonorId(
    donorId: string,
  ): Promise<ImpactMetricAggregate[]>;
  abstract findByRecipientId(
    recipientId: string,
  ): Promise<ImpactMetricAggregate[]>;
  abstract getAggregateMetrics(): Promise<{
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
  }>;
}
import { Injectable } from '@nestjs/common';
import {
  DonorImpactSummary,
  ImpactReadPort,
} from '../../../donor/application/ports/impact-read.port';
import { ImpactMetricRepository } from '../repositories/impact-metric.repository';

/**
 * Implementation of donor's ImpactReadPort, owned by the analytics
 * context. This is the upstream side of the donor→analytics dependency:
 * analytics provides the data; donor defines the shape.
 */
@Injectable()
export class AnalyticsImpactReadAdapter implements ImpactReadPort {
  constructor(private readonly metrics: ImpactMetricRepository) {}

  async getDonorImpact(donorId: string): Promise<DonorImpactSummary> {
    const metrics = await this.metrics.findByDonorId(donorId);
    return {
      donorId,
      totalMealsSaved: metrics.reduce((sum, m) => sum + m.mealsSaved, 0),
      totalCo2Avoided: metrics.reduce(
        (sum, m) => sum + Number(m.co2KgAvoided),
        0,
      ),
      totalKgDelivered: metrics.reduce(
        (sum, m) => sum + Number(m.kgDelivered),
        0,
      ),
    };
  }
}
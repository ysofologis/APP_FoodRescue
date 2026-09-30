import { Inject, Injectable } from '@nestjs/common';
import {
  DonorImpactSummary,
  ImpactReadPort,
} from '../../../donor/application/ports/impact-read.port';
import { ImpactMetricRepository } from '../../domain/repositories/impact-metric.repository';

/**
 * Implementation of donor's ImpactReadPort, owned by the analytics
 * context. The donor port is implemented here; analytics provides the
 * data; donor defines the shape.
 *
 * Injection via the abstract port token (`@Inject(ImpactMetricRepository)`)
 * so Nest resolves through the port binding, not the concrete impl class.
 * This keeps cross-module DI working across the analytics → donor module
 * boundary.
 */
@Injectable()
export class AnalyticsImpactReadAdapter implements ImpactReadPort {
  constructor(
    @Inject(ImpactMetricRepository)
    private readonly metrics: ImpactMetricRepository,
  ) {}

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
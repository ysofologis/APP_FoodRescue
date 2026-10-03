import { Inject, Injectable } from '@nestjs/common';
import {
  RecipientImpactReadPort,
  RecipientImpactSummary,
} from '../../../donor/application/ports/recipient-impact-read.port';
import { ImpactMetricRepository } from '../../domain/repositories/impact-metric.repository';

/**
 * Implementation of donor's RecipientImpactReadPort, owned by the
 * analytics context. Routes through findByRecipientId on the
 * repository — distinct from the donor-shaped read.
 */
@Injectable()
export class AnalyticsRecipientImpactReadAdapter
  implements RecipientImpactReadPort
{
  constructor(
    @Inject(ImpactMetricRepository)
    private readonly metrics: ImpactMetricRepository,
  ) {}

  async getRecipientImpact(
    recipientId: string,
  ): Promise<RecipientImpactSummary> {
    const metrics = await this.metrics.findByRecipientId(recipientId);
    return {
      recipientId,
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
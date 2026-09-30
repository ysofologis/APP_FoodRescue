import { Inject, Injectable } from '@nestjs/common';
import {
  PublicImpactReadPort,
  PublicImpactSummary,
} from '../../../donor/application/ports/public-impact-read.port';
import { ImpactMetricRepository } from '../../domain/repositories/impact-metric.repository';

@Injectable()
export class AnalyticsPublicImpactReadAdapter implements PublicImpactReadPort {
  constructor(
    @Inject(ImpactMetricRepository)
    private readonly metrics: ImpactMetricRepository,
  ) {}

  async getPublicImpact(): Promise<PublicImpactSummary> {
    return this.metrics.getAggregateMetrics();
  }
}
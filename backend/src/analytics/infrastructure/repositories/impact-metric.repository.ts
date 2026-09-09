import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../domain/repositories/impact-metric.repository';

@Injectable()
export class ImpactMetricRepository implements ImpactMetricRepoInterface {
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly repo: Repository<ImpactMetricAggregate>,
  ) {}

  async save(metric: ImpactMetricAggregate): Promise<void> {
    await this.repo.save(metric);
  }

  async findById(id: string): Promise<ImpactMetricAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByDonorId(donorId: string): Promise<ImpactMetricAggregate[]> {
    return this.repo.find({ where: { donorId } });
  }

  async findByRecipientId(recipientId: string): Promise<ImpactMetricAggregate[]> {
    return this.repo.find({ where: { recipientId } });
  }

  async getAggregateMetrics(): Promise<{
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
  }> {
    const result = await this.repo
      .createQueryBuilder('metric')
      .select('SUM(metric.mealsSaved)', 'totalMealsSaved')
      .addSelect('SUM(metric.co2KgAvoided)', 'totalCo2Avoided')
      .addSelect('SUM(metric.kgDelivered)', 'totalKgDelivered')
      .getRawOne();

    return {
      totalMealsSaved: parseInt(result.totalMealsSaved, 10) || 0,
      totalCo2Avoided: parseFloat(result.totalCo2Avoided) || 0,
      totalKgDelivered: parseFloat(result.totalKgDelivered) || 0,
    };
  }
}

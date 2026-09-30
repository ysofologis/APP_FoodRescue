import { Exclude, Expose } from 'class-transformer';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';

@Exclude()
export class ImpactMetricResponseDto {
  @Expose()
  id!: string;

  @Expose()
  donorId!: string;

  @Expose()
  recipientId!: string;

  @Expose()
  mealsSaved!: number;

  @Expose()
  co2KgAvoided!: number;

  @Expose()
  kgDelivered!: number;

  @Expose()
  nutritionalSummary!: Record<string, unknown>;

  @Expose()
  recordedAt!: Date;

  @Expose()
  status!: string;

  static fromAggregate(m: ImpactMetricAggregate): ImpactMetricResponseDto {
    const dto = new ImpactMetricResponseDto();
    dto.id = m.id;
    dto.donorId = m.donorId;
    dto.recipientId = m.recipientId;
    dto.mealsSaved = m.mealsSaved;
    dto.co2KgAvoided = Number(m.co2KgAvoided);
    dto.kgDelivered = Number(m.kgDelivered);
    dto.nutritionalSummary = m.nutritionalSummary ?? {};
    dto.recordedAt = m.recordedAt;
    dto.status = m.status;
    return dto;
  }
}

@Exclude()
export class AggregateImpactResponseDto {
  @Expose()
  totalMealsSaved!: number;

  @Expose()
  totalCo2Avoided!: number;

  @Expose()
  totalKgDelivered!: number;

  static fromAggregate(g: {
    totalMealsSaved: number;
    totalCo2Avoided: number;
    totalKgDelivered: number;
  }): AggregateImpactResponseDto {
    return Object.assign(new AggregateImpactResponseDto(), {
      totalMealsSaved: g.totalMealsSaved,
      totalCo2Avoided: g.totalCo2Avoided,
      totalKgDelivered: g.totalKgDelivered,
    });
  }
}
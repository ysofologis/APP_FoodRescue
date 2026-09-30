import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('impact_metrics')
export class ImpactMetricAggregate {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  donorId: string;

  @Column({ type: 'varchar', length: 36 })
  recipientId: string;

  @Column({ type: 'int' })
  mealsSaved: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  co2KgAvoided: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  kgDelivered: number;

  @Column({ type: 'simple-json', default: {} })
  nutritionalSummary: Record<string, unknown>;

  @Column({ type: 'datetime' })
  recordedAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  static create(
    donorId: string,
    recipientId: string,
    mealsSaved: number,
    co2KgAvoided: number,
    kgDelivered: number,
    nutritionalSummary?: Record<string, unknown>,
  ): [ImpactMetricAggregate, any] {
    const metric = new ImpactMetricAggregate();
    metric.id = uuid();
    metric.donorId = donorId;
    metric.recipientId = recipientId;
    metric.mealsSaved = mealsSaved;
    metric.co2KgAvoided = co2KgAvoided;
    metric.kgDelivered = kgDelivered;
    metric.nutritionalSummary = nutritionalSummary || {};
    metric.recordedAt = new Date();
    metric.status = 'ACTIVE';

    return [metric, { type: 'impact.recorded', metricId: metric.id }];
  }
}

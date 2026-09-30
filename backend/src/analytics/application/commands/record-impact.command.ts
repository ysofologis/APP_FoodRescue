import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository } from '../../domain/repositories/impact-metric.repository';
import { ImpactRecordedEvent } from '../../domain/events/impact-recorded.event';

export class RecordImpactCommand {
  constructor(
    public readonly donorId: string,
    public readonly recipientId: string,
    public readonly mealsSaved: number,
    public readonly co2KgAvoided: number,
    public readonly kgDelivered: number,
    public readonly nutritionalSummary?: Record<string, unknown>,
  ) {}
}

@Injectable()
@CommandHandler(RecordImpactCommand)
export class RecordImpactCommandHandler
  implements ICommandHandler<RecordImpactCommand, ImpactMetricAggregate>
{
  constructor(
    private readonly metrics: ImpactMetricRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: RecordImpactCommand): Promise<ImpactMetricAggregate> {
    if (command.mealsSaved < 0) {
      throw new BadRequestException('mealsSaved must be >= 0');
    }
    if (command.co2KgAvoided < 0) {
      throw new BadRequestException('co2KgAvoided must be >= 0');
    }
    if (command.kgDelivered < 0) {
      throw new BadRequestException('kgDelivered must be >= 0');
    }

    const [metric] = ImpactMetricAggregate.create(
      command.donorId,
      command.recipientId,
      command.mealsSaved,
      command.co2KgAvoided,
      command.kgDelivered,
      command.nutritionalSummary,
    );

    await this.metrics.save(metric);
    this.events.publish(
      new ImpactRecordedEvent(
        metric.id,
        metric.donorId,
        metric.recipientId,
        metric.mealsSaved,
        Number(metric.co2KgAvoided),
        Number(metric.kgDelivered),
      ) as object,
    );
    return metric;
  }
}
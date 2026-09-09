import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactMetricAggregate } from '../../domain/aggregates/impact-metric.aggregate';
import { ImpactMetricRepository as ImpactMetricRepoInterface } from '../../domain/repositories/impact-metric.repository';

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

@CommandHandler(RecordImpactCommand)
export class RecordImpactCommandHandler
  implements ICommandHandler<RecordImpactCommand>
{
  constructor(
    @InjectRepository(ImpactMetricAggregate)
    private readonly metricRepo: Repository<ImpactMetricAggregate>,
  ) {}

  async execute(command: RecordImpactCommand): Promise<ImpactMetricAggregate> {
    const [metric] = ImpactMetricAggregate.create(
      command.donorId,
      command.recipientId,
      command.mealsSaved,
      command.co2KgAvoided,
      command.kgDelivered,
      command.nutritionalSummary,
    );

    await this.metricRepo.save(metric);
    return metric;
  }
}

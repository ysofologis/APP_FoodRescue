import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

export class ConfirmDeliveryCommand {
  constructor(public readonly runId: string) {}
}

@Injectable()
@CommandHandler(ConfirmDeliveryCommand)
export class ConfirmDeliveryCommandHandler
  implements ICommandHandler<ConfirmDeliveryCommand, DistributionRunAggregate>
{
  constructor(
    private readonly runs: DistributionRunRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: ConfirmDeliveryCommand): Promise<DistributionRunAggregate> {
    const run = await this.runs.findById(command.runId);
    if (!run) {
      throw new NotFoundException(`Distribution run not found: ${command.runId}`);
    }

    const [, event] = run.confirmDelivery();
    await this.runs.save(run);
    this.events.publish(event as object);
    return run;
  }
}
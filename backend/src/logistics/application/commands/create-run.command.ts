import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

export class CreateRunCommand {
  constructor(
    public readonly name: string,
    public readonly driverId: string,
    public readonly listingIds: string[],
    public readonly scheduledPickup: Date,
    public readonly routeNotes?: string,
  ) {}
}

@Injectable()
@CommandHandler(CreateRunCommand)
export class CreateRunCommandHandler
  implements ICommandHandler<CreateRunCommand, DistributionRunAggregate>
{
  constructor(
    private readonly runs: DistributionRunRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: CreateRunCommand): Promise<DistributionRunAggregate> {
    if (!command.name || command.name.trim().length < 2) {
      throw new BadRequestException('Run name must be at least 2 characters');
    }
    if (!command.driverId) {
      throw new BadRequestException('Driver ID is required');
    }
    if (!Array.isArray(command.listingIds) || command.listingIds.length === 0) {
      throw new BadRequestException('At least one listing is required');
    }
    if (!command.scheduledPickup || isNaN(command.scheduledPickup.getTime())) {
      throw new BadRequestException('Valid scheduledPickup is required');
    }

    const [run, event] = DistributionRunAggregate.create(
      command.name,
      command.driverId,
      command.listingIds,
      command.scheduledPickup,
      command.routeNotes,
    );

    await this.runs.save(run);
    this.events.publish(event as object);
    return run;
  }
}
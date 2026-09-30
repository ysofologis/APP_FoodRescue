import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

export class AssignDriverCommand {
  constructor(
    public readonly runId: string,
    public readonly driverId: string,
  ) {}
}

@Injectable()
@CommandHandler(AssignDriverCommand)
export class AssignDriverCommandHandler
  implements ICommandHandler<AssignDriverCommand, DistributionRunAggregate>
{
  constructor(private readonly runs: DistributionRunRepository) {}

  async execute(command: AssignDriverCommand): Promise<DistributionRunAggregate> {
    const run = await this.runs.findById(command.runId);
    if (!run) {
      throw new NotFoundException(
        `Distribution run not found: ${command.runId}`,
      );
    }

    // assignDriver() throws on invariant violation (only SCHEDULED runs can be reassigned).
    run.assignDriver(command.driverId);
    await this.runs.save(run);
    return run;
  }
}
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

export class CancelRunCommand {
  constructor(
    public readonly runId: string,
    public readonly reason: string,
  ) {}
}

@Injectable()
@CommandHandler(CancelRunCommand)
export class CancelRunCommandHandler
  implements ICommandHandler<CancelRunCommand, DistributionRunAggregate>
{
  constructor(private readonly runs: DistributionRunRepository) {}

  async execute(command: CancelRunCommand): Promise<DistributionRunAggregate> {
    const run = await this.runs.findById(command.runId);
    if (!run) {
      throw new NotFoundException(`Distribution run not found: ${command.runId}`);
    }
    if (!command.reason || command.reason.trim().length < 3) {
      throw new BadRequestException('Cancel reason must be at least 3 characters');
    }

    run.cancel(command.reason);
    await this.runs.save(run);
    return run;
  }
}
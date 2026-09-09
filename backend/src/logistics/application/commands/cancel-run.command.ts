import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../domain/repositories/distribution-run.repository';

export class CancelRunCommand {
  constructor(
    public readonly runId: string,
    public readonly reason: string,
  ) {}
}

@CommandHandler(CancelRunCommand)
export class CancelRunCommandHandler
  implements ICommandHandler<CancelRunCommand>
{
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly runRepo: Repository<DistributionRunAggregate>,
  ) {}

  async execute(command: CancelRunCommand): Promise<DistributionRunAggregate> {
    const run = await this.runRepo.findOne({ where: { id: command.runId } });

    if (!run) {
      throw new Error(`Distribution run not found: ${command.runId}`);
    }

    run.cancel(command.reason);
    await this.runRepo.save(run);
    return run;
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../domain/repositories/distribution-run.repository';

export class AssignDriverCommand {
  constructor(
    public readonly runId: string,
    public readonly driverId: string,
  ) {}
}

@CommandHandler(AssignDriverCommand)
export class AssignDriverCommandHandler
  implements ICommandHandler<AssignDriverCommand>
{
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly runRepo: Repository<DistributionRunAggregate>,
  ) {}

  async execute(command: AssignDriverCommand): Promise<DistributionRunAggregate> {
    const run = await this.runRepo.findOne({ where: { id: command.runId } });

    if (!run) {
      throw new Error(`Distribution run not found: ${command.runId}`);
    }

    run.assignDriver(command.driverId);
    await this.runRepo.save(run);
    return run;
  }
}

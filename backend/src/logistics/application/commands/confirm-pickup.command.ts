import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../domain/repositories/distribution-run.repository';

export class ConfirmPickupCommand {
  constructor(public readonly runId: string) {}
}

@CommandHandler(ConfirmPickupCommand)
export class ConfirmPickupCommandHandler
  implements ICommandHandler<ConfirmPickupCommand>
{
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly runRepo: Repository<DistributionRunAggregate>,
  ) {}

  async execute(command: ConfirmPickupCommand): Promise<DistributionRunAggregate> {
    const run = await this.runRepo.findOne({ where: { id: command.runId } });

    if (!run) {
      throw new Error(`Distribution run not found: ${command.runId}`);
    }

    run.confirmPickup();
    await this.runRepo.save(run);
    return run;
  }
}

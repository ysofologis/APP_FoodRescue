import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';
import { DisputeRepository as DisputeRepoInterface } from '../../domain/repositories/dispute.repository';
import { DisputeResolutionService } from '../../domain/services/dispute-resolution.service';

export class ResolveDisputeCommand {
  constructor(
    public readonly disputeId: string,
    public readonly resolution: string,
    public readonly resolvedBy: string,
  ) {}
}

@CommandHandler(ResolveDisputeCommand)
export class ResolveDisputeCommandHandler
  implements ICommandHandler<ResolveDisputeCommand>
{
  constructor(
    @InjectRepository(DisputeAggregate)
    private readonly disputeRepo: Repository<DisputeAggregate>,
  ) {}

  async execute(command: ResolveDisputeCommand): Promise<DisputeAggregate> {
    DisputeResolutionService.validateResolution(
      command.disputeId,
      command.resolution,
      command.resolvedBy,
    );

    const dispute = await this.disputeRepo.findOne({
      where: { id: command.disputeId },
    });

    if (!dispute) {
      throw new Error(`Dispute not found: ${command.disputeId}`);
    }

    dispute.resolve(command.resolution, command.resolvedBy);
    await this.disputeRepo.save(dispute);
    return dispute;
  }
}

import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';
import { DisputeRepository } from '../../domain/repositories/dispute.repository';

export class ResolveDisputeCommand {
  constructor(
    public readonly disputeId: string,
    public readonly resolvedBy: string,
    public readonly resolution: string,
  ) {}
}

@Injectable()
@CommandHandler(ResolveDisputeCommand)
export class ResolveDisputeCommandHandler
  implements ICommandHandler<ResolveDisputeCommand, DisputeAggregate>
{
  constructor(
    private readonly disputes: DisputeRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: ResolveDisputeCommand): Promise<DisputeAggregate> {
    if (!command.resolution || command.resolution.trim().length < 3) {
      throw new BadRequestException('Resolution must be at least 3 characters');
    }

    const dispute = await this.disputes.findById(command.disputeId);
    if (!dispute) {
      throw new NotFoundException(`Dispute not found: ${command.disputeId}`);
    }

    const [, event] = dispute.resolve(command.resolution, command.resolvedBy);
    await this.disputes.save(dispute);
    this.events.publish(event as object);
    return dispute;
  }
}
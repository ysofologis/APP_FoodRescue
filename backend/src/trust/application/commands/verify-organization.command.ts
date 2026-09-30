import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository } from '../../domain/repositories/verifier.repository';

export class VerifyOrganizationCommand {
  constructor(
    public readonly verifierId: string,
    public readonly organizationId: string,
    public readonly organizationType: 'DONOR' | 'RECIPIENT',
    public readonly notes?: string,
  ) {}
}

@Injectable()
@CommandHandler(VerifyOrganizationCommand)
export class VerifyOrganizationCommandHandler
  implements ICommandHandler<VerifyOrganizationCommand, VerifierAggregate>
{
  constructor(
    private readonly verifiers: VerifierRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: VerifyOrganizationCommand): Promise<VerifierAggregate> {
    const verifier = await this.verifiers.findById(command.verifierId);
    if (!verifier) {
      throw new NotFoundException(`Verifier not found: ${command.verifierId}`);
    }

    const [, event] = verifier.recordVerification(
      command.organizationId,
      command.organizationType,
      true,
      command.notes,
    );
    await this.verifiers.save(verifier);
    this.events.publish(event as object);
    return verifier;
  }
}
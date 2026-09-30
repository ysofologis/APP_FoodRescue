import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository } from '../../domain/repositories/verifier.repository';
import { VerificationCompletedEvent } from '../../domain/events/verification-completed.event';

/**
 * Cross-context action: blacklist signals a downstream context (donor or
 * recipient) to suspend the target organization. The trust context owns
 * the audit trail; the suspended status lives in the target context.
 *
 * The handler emits a VerificationCompletedEvent with `verified: false`
 * so any subscriber that reacts to verification changes can also react
 * to revocations uniformly.
 */
export class BlacklistOrganizationCommand {
  constructor(
    public readonly verifierId: string,
    public readonly organizationId: string,
    public readonly organizationType: 'DONOR' | 'RECIPIENT',
    public readonly reason: string,
  ) {}
}

@Injectable()
@CommandHandler(BlacklistOrganizationCommand)
export class BlacklistOrganizationCommandHandler
  implements ICommandHandler<BlacklistOrganizationCommand, VerifierAggregate>
{
  constructor(
    private readonly verifiers: VerifierRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: BlacklistOrganizationCommand): Promise<VerifierAggregate> {
    const verifier = await this.verifiers.findById(command.verifierId);
    if (!verifier) {
      throw new Error(`Verifier not found: ${command.verifierId}`);
    }

    // Audit-style delegation through the aggregate; recordVerification
    // returns the event we publish.
    const [, event] = verifier.recordVerification(
      command.organizationId,
      command.organizationType,
      false,
      command.reason,
    );

    // Reason travels with the event for downstream audit subscribers.
    const enrichedEvent = Object.assign(
      new VerificationCompletedEvent(
        event.verifierId,
        event.organizationId,
        event.organizationType,
        event.verified,
      ),
      { reason: command.reason },
    );

    await this.verifiers.save(verifier);
    this.events.publish(enrichedEvent as object);
    return verifier;
  }
}
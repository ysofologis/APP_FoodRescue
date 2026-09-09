import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository as VerifierRepoInterface } from '../../domain/repositories/verifier.repository';

export class BlacklistOrganizationCommand {
  constructor(
    public readonly verifierId: string,
    public readonly organizationId: string,
    public readonly reason: string,
  ) {}
}

@CommandHandler(BlacklistOrganizationCommand)
export class BlacklistOrganizationCommandHandler
  implements ICommandHandler<BlacklistOrganizationCommand>
{
  constructor(
    @InjectRepository(VerifierAggregate)
    private readonly verifierRepo: Repository<VerifierAggregate>,
  ) {}

  async execute(command: BlacklistOrganizationCommand): Promise<VerifierAggregate> {
    const verifier = await this.verifierRepo.findOne({
      where: { id: command.verifierId },
    });

    if (!verifier) {
      throw new Error(`Verifier not found: ${command.verifierId}`);
    }

    if (!verifier.active) {
      throw new Error('Verifier is not active');
    }

    // In a real implementation, this would update the recipient/donor status to blacklisted
    return verifier;
  }
}

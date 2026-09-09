import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository as VerifierRepoInterface } from '../../domain/repositories/verifier.repository';

export class VerifyOrganizationCommand {
  constructor(
    public readonly verifierId: string,
    public readonly organizationId: string,
    public readonly organizationType: string,
    public readonly notes?: string,
  ) {}
}

@CommandHandler(VerifyOrganizationCommand)
export class VerifyOrganizationCommandHandler
  implements ICommandHandler<VerifyOrganizationCommand>
{
  constructor(
    @InjectRepository(VerifierAggregate)
    private readonly verifierRepo: Repository<VerifierAggregate>,
  ) {}

  async execute(command: VerifyOrganizationCommand): Promise<VerifierAggregate> {
    const verifier = await this.verifierRepo.findOne({
      where: { id: command.verifierId },
    });

    if (!verifier) {
      throw new Error(`Verifier not found: ${command.verifierId}`);
    }

    if (!verifier.active) {
      throw new Error('Verifier is not active');
    }

    // In a real implementation, this would update the recipient/donor status
    // For now, we just record the verification action
    return verifier;
  }
}

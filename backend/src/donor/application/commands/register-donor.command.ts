import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';
import { DonorRepository as DonorRepoInterface } from '../../domain/repositories/donor.repository';
import { DonorValidationService } from '../../domain/services/donor-validation.service';

export class RegisterDonorCommand {
  constructor(
    public readonly name: string,
    public readonly contactEmail: string,
    public readonly businessLicense?: string,
    public readonly contactPhone?: string,
    public readonly address?: string,
  ) {}
}

@CommandHandler(RegisterDonorCommand)
export class RegisterDonorCommandHandler
  implements ICommandHandler<RegisterDonorCommand>
{
  constructor(
    @InjectRepository(DonorAggregate)
    private readonly donorRepo: Repository<DonorAggregate>,
  ) {}

  async execute(command: RegisterDonorCommand): Promise<DonorAggregate> {
    DonorValidationService.validateOnboarding(
      command.name,
      command.contactEmail,
    );

    const [donor] = DonorAggregate.create(
      command.name,
      command.contactEmail,
      command.businessLicense,
      command.contactPhone,
      command.address,
    );

    await this.donorRepo.save(donor);
    return donor;
  }
}

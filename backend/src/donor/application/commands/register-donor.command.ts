import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';
import { DonorRepository } from '../../domain/repositories/donor.repository';
import { DonorValidationService } from '../../domain/services/donor-validation.service';
import { DonorCreatedEvent } from '../../domain/events/donor-created.event';

export class RegisterDonorCommand {
  constructor(
    public readonly name: string,
    public readonly contactEmail: string,
    public readonly businessLicense?: string,
    public readonly contactPhone?: string,
    public readonly address?: string,
  ) {}
}

@Injectable()
@CommandHandler(RegisterDonorCommand)
export class RegisterDonorCommandHandler
  implements ICommandHandler<RegisterDonorCommand, DonorAggregate>
{
  constructor(
    private readonly donors: DonorRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: RegisterDonorCommand): Promise<DonorAggregate> {
    try {
      DonorValidationService.validateOnboarding(
        command.name,
        command.contactEmail,
      );
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Invalid donor onboarding',
      );
    }

    const [donor, event] = DonorAggregate.create(
      command.name,
      command.contactEmail,
      command.businessLicense,
      command.contactPhone,
      command.address,
    );

    await this.donors.save(donor);
    this.events.publish(event as object);
    return donor;
  }
}
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';
import { RecipientRepository } from '../../domain/repositories/recipient.repository';

export class RegisterRecipientCommand {
  constructor(
    public readonly name: string,
    public readonly orgType: string,
    public readonly contactEmail: string,
    public readonly legalDocsRef?: string,
    public readonly contactPhone?: string,
    public readonly address?: string,
  ) {}
}

@Injectable()
@CommandHandler(RegisterRecipientCommand)
export class RegisterRecipientCommandHandler
  implements ICommandHandler<RegisterRecipientCommand, RecipientAggregate>
{
  constructor(
    private readonly recipients: RecipientRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: RegisterRecipientCommand): Promise<RecipientAggregate> {
    if (!command.name || command.name.trim().length < 2) {
      throw new BadRequestException('Recipient name must be at least 2 characters');
    }
    if (!command.contactEmail || !command.contactEmail.includes('@')) {
      throw new BadRequestException('Valid contact email is required');
    }

    const [recipient, event] = RecipientAggregate.create(
      command.name,
      command.orgType,
      command.contactEmail,
      command.legalDocsRef,
      command.contactPhone,
      command.address,
    );

    await this.recipients.save(recipient);
    this.events.publish(event as object);
    return recipient;
  }
}
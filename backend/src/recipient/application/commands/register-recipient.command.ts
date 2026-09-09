import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';
import { RecipientRepository as RecipientRepoInterface } from '../../domain/repositories/recipient.repository';

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

@CommandHandler(RegisterRecipientCommand)
export class RegisterRecipientCommandHandler
  implements ICommandHandler<RegisterRecipientCommand>
{
  constructor(
    @InjectRepository(RecipientAggregate)
    private readonly recipientRepo: Repository<RecipientAggregate>,
  ) {}

  async execute(command: RegisterRecipientCommand): Promise<RecipientAggregate> {
    const [recipient] = RecipientAggregate.create(
      command.name,
      command.orgType,
      command.contactEmail,
      command.legalDocsRef,
      command.contactPhone,
      command.address,
    );

    await this.recipientRepo.save(recipient);
    return recipient;
  }
}

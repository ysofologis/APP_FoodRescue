import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientAggregate } from '../../recipient/domain/aggregates/recipient.aggregate';
import { RecipientRepository as RecipientRepoInterface } from '../../recipient/domain/repositories/recipient.repository';

export class GetRecipientByIdQuery {
  constructor(public readonly recipientId: string) {}
}

@QueryHandler(GetRecipientByIdQuery)
export class GetRecipientByIdQueryHandler
  implements IQueryHandler<GetRecipientByIdQuery>
{
  constructor(
    @InjectRepository(RecipientAggregate)
    private readonly recipientRepo: Repository<RecipientAggregate>,
  ) {}

  async execute(query: GetRecipientByIdQuery): Promise<RecipientAggregate | null> {
    return this.recipientRepo.findOne({ where: { id: query.recipientId } });
  }
}

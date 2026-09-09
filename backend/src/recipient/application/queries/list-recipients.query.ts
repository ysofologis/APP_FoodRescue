import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';
import { RecipientRepository as RecipientRepoInterface } from '../../domain/repositories/recipient.repository';

export class ListRecipientsQuery {
  constructor(public readonly verifiedOnly?: boolean) {}
}

@QueryHandler(ListRecipientsQuery)
export class ListRecipientsQueryHandler
  implements IQueryHandler<ListRecipientsQuery>
{
  constructor(
    @InjectRepository(RecipientAggregate)
    private readonly recipientRepo: Repository<RecipientAggregate>,
  ) {}

  async execute(query: ListRecipientsQuery): Promise<RecipientAggregate[]> {
    if (query.verifiedOnly) {
      return this.recipientRepo.find({ where: { status: 'VERIFIED' } });
    }
    return this.recipientRepo.find();
  }
}

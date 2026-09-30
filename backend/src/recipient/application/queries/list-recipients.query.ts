import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';
import { RecipientRepository } from '../../domain/repositories/recipient.repository';

export class ListRecipientsQuery {
  constructor(public readonly verifiedOnly: boolean = false) {}
}

@Injectable()
@QueryHandler(ListRecipientsQuery)
export class ListRecipientsQueryHandler
  implements IQueryHandler<ListRecipientsQuery, RecipientAggregate[]>
{
  constructor(private readonly recipients: RecipientRepository) {}

  async execute(query: ListRecipientsQuery): Promise<RecipientAggregate[]> {
    return query.verifiedOnly
      ? this.recipients.findVerified()
      : this.recipients.findAll();
  }
}
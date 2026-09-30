import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { RecipientLookupPort } from '../ports/recipient-lookup.port';

export class GetRecipientByIdQuery {
  constructor(public readonly recipientId: string) {}
}

@Injectable()
@QueryHandler(GetRecipientByIdQuery)
export class GetRecipientByIdQueryHandler
  implements IQueryHandler<GetRecipientByIdQuery>
{
  constructor(private readonly recipients: RecipientLookupPort) {}

  async execute(query: GetRecipientByIdQuery) {
    return this.recipients.findById(query.recipientId);
  }
}
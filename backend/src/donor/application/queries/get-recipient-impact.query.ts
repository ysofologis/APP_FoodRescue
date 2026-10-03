import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import {
  RecipientImpactReadPort,
  RecipientImpactSummary,
} from '../ports/recipient-impact-read.port';

export class GetRecipientImpactQuery {
  constructor(public readonly recipientId: string) {}
}

@Injectable()
@QueryHandler(GetRecipientImpactQuery)
export class GetRecipientImpactQueryHandler
  implements IQueryHandler<GetRecipientImpactQuery>
{
  constructor(private readonly impact: RecipientImpactReadPort) {}

  async execute(
    query: GetRecipientImpactQuery,
  ): Promise<RecipientImpactSummary> {
    return this.impact.getRecipientImpact(query.recipientId);
  }
}
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ImpactReadPort, DonorImpactSummary } from '../ports/impact-read.port';

/**
 * Recipient impact goes through the same analytics port — the analytics
 * ACL implementation routes by id-prefix or method-overload internally.
 * Kept as a separate query so the UI can name the intent precisely.
 */
export class GetRecipientImpactQuery {
  constructor(public readonly recipientId: string) {}
}

@Injectable()
@QueryHandler(GetRecipientImpactQuery)
export class GetRecipientImpactQueryHandler
  implements IQueryHandler<GetRecipientImpactQuery>
{
  constructor(private readonly impact: ImpactReadPort) {}

  async execute(query: GetRecipientImpactQuery): Promise<DonorImpactSummary> {
    // Reuses the same ACL port. Analytics-side implementation will
    // branch on id shape or expose a dedicated method — TBD with the
    // chosen cross-context integration pattern.
    return this.impact.getDonorImpact(query.recipientId);
  }
}
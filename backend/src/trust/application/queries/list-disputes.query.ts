import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';
import { DisputeRepository } from '../../domain/repositories/dispute.repository';

export class ListDisputesQuery {
  constructor(
    public readonly openOnly: boolean = true,
    public readonly listingId?: string,
  ) {}
}

@Injectable()
@QueryHandler(ListDisputesQuery)
export class ListDisputesQueryHandler
  implements IQueryHandler<ListDisputesQuery, DisputeAggregate[]>
{
  constructor(private readonly disputes: DisputeRepository) {}

  async execute(query: ListDisputesQuery): Promise<DisputeAggregate[]> {
    if (query.listingId) {
      return this.disputes.findByListingId(query.listingId);
    }
    return query.openOnly
      ? this.disputes.findOpen()
      : [];
  }
}
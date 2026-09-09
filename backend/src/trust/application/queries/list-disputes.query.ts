import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';
import { DisputeRepository as DisputeRepoInterface } from '../../domain/repositories/dispute.repository';

export class ListDisputesQuery {
  constructor(public readonly openOnly?: boolean) {}
}

@QueryHandler(ListDisputesQuery)
export class ListDisputesQueryHandler
  implements IQueryHandler<ListDisputesQuery>
{
  constructor(
    @InjectRepository(DisputeAggregate)
    private readonly disputeRepo: Repository<DisputeAggregate>,
  ) {}

  async execute(query: ListDisputesQuery): Promise<DisputeAggregate[]> {
    if (query.openOnly) {
      return this.disputeRepo.find({ where: { status: 'OPEN' } });
    }
    return this.disputeRepo.find();
  }
}

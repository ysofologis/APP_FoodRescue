import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../domain/repositories/distribution-run.repository';

export class ListDistributionRunsQuery {
  constructor(public readonly status?: string) {}
}

@QueryHandler(ListDistributionRunsQuery)
export class ListDistributionRunsQueryHandler
  implements IQueryHandler<ListDistributionRunsQuery>
{
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly runRepo: Repository<DistributionRunAggregate>,
  ) {}

  async execute(query: ListDistributionRunsQuery): Promise<DistributionRunAggregate[]> {
    if (query.status) {
      return this.runRepo.find({ where: { status: query.status } });
    }
    return this.runRepo.find();
  }
}

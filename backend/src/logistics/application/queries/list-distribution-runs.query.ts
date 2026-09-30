import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

export class ListDistributionRunsQuery {
  constructor(
    public readonly driverId?: string,
    public readonly status?: string,
  ) {}
}

@Injectable()
@QueryHandler(ListDistributionRunsQuery)
export class ListDistributionRunsQueryHandler
  implements IQueryHandler<ListDistributionRunsQuery, DistributionRunAggregate[]>
{
  constructor(private readonly runs: DistributionRunRepository) {}

  async execute(
    query: ListDistributionRunsQuery,
  ): Promise<DistributionRunAggregate[]> {
    if (query.driverId) {
      return this.runs.findByDriverId(query.driverId);
    }
    if (query.status) {
      return this.runs.findByStatus(query.status);
    }
    return this.runs.findByStatus('SCHEDULED');
  }
}
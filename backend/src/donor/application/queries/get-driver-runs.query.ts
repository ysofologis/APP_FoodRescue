import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../logistics/domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../logistics/domain/repositories/distribution-run.repository';

export class GetDriverRunsQuery {
  constructor(public readonly driverId: string) {}
}

@QueryHandler(GetDriverRunsQuery)
export class GetDriverRunsQueryHandler
  implements IQueryHandler<GetDriverRunsQuery>
{
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly runRepo: Repository<DistributionRunAggregate>,
  ) {}

  async execute(query: GetDriverRunsQuery): Promise<DistributionRunAggregate[]> {
    return this.runRepo.findByDriverId(query.driverId);
  }
}

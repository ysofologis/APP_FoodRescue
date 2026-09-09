import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';
import { DonorRepository as DonorRepoInterface } from '../../domain/repositories/donor.repository';

export class GetDonorByIdQuery {
  constructor(public readonly donorId: string) {}
}

@QueryHandler(GetDonorByIdQuery)
export class GetDonorByIdQueryHandler
  implements IQueryHandler<GetDonorByIdQuery>
{
  constructor(
    @InjectRepository(DonorAggregate)
    private readonly donorRepo: Repository<DonorAggregate>,
  ) {}

  async execute(query: GetDonorByIdQuery): Promise<DonorAggregate | null> {
    return this.donorRepo.findOne({ where: { id: query.donorId } });
  }
}

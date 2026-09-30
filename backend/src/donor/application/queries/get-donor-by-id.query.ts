import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';
import { DonorRepository } from '../../domain/repositories/donor.repository';

export class GetDonorByIdQuery {
  constructor(public readonly donorId: string) {}
}

@Injectable()
@QueryHandler(GetDonorByIdQuery)
export class GetDonorByIdQueryHandler
  implements IQueryHandler<GetDonorByIdQuery, DonorAggregate | null>
{
  constructor(private readonly donors: DonorRepository) {}

  async execute(query: GetDonorByIdQuery): Promise<DonorAggregate | null> {
    return this.donors.findById(query.donorId);
  }
}
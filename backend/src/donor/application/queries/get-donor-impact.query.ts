import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ImpactReadPort } from '../ports/impact-read.port';

export class GetDonorImpactQuery {
  constructor(public readonly donorId: string) {}
}

@Injectable()
@QueryHandler(GetDonorImpactQuery)
export class GetDonorImpactQueryHandler
  implements IQueryHandler<GetDonorImpactQuery>
{
  constructor(private readonly impact: ImpactReadPort) {}

  async execute(query: GetDonorImpactQuery) {
    return this.impact.getDonorImpact(query.donorId);
  }
}
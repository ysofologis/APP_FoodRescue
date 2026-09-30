import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { PublicImpactReadPort } from '../ports/public-impact-read.port';

export class GetPublicImpactQuery {}

@Injectable()
@QueryHandler(GetPublicImpactQuery)
export class GetPublicImpactQueryHandler
  implements IQueryHandler<GetPublicImpactQuery>
{
  constructor(private readonly impact: PublicImpactReadPort) {}

  async execute() {
    return this.impact.getPublicImpact();
  }
}
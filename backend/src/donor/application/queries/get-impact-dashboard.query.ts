import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ImpactReadPort } from '../ports/impact-read.port';

export class GetImpactDashboardQuery {
  constructor(public readonly donorId?: string) {}
}

@Injectable()
@QueryHandler(GetImpactDashboardQuery)
export class GetImpactDashboardQueryHandler
  implements IQueryHandler<GetImpactDashboardQuery>
{
  constructor(private readonly impact: ImpactReadPort) {}

  async execute(query: GetImpactDashboardQuery) {
    // The dashboard is keyed by donor when present, but the public
    // view is donor-scoped or global — the ACL implementation decides.
    if (query.donorId) {
      return this.impact.getDonorImpact(query.donorId);
    }
    // No donorId → caller wants the public dashboard shape.
    // Surfacing through the same port keeps the ACL minimal; analytics
    // can extend the port later (e.g. add getDashboard()).
    const summary = await this.impact.getDonorImpact('__public__');
    return summary;
  }
}
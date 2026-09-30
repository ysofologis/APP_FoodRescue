import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DriverRunsReadPort } from '../ports/driver-runs-read.port';

export class GetDriverRunsQuery {
  constructor(public readonly driverId: string) {}
}

@Injectable()
@QueryHandler(GetDriverRunsQuery)
export class GetDriverRunsQueryHandler
  implements IQueryHandler<GetDriverRunsQuery>
{
  constructor(private readonly runs: DriverRunsReadPort) {}

  async execute(query: GetDriverRunsQuery) {
    return this.runs.findByDriverId(query.driverId);
  }
}
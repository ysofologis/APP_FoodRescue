import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { VerifiersReadPort } from '../ports/verifiers-read.port';

export class GetVerifiersQuery {
  constructor(public readonly activeOnly?: boolean) {}
}

@Injectable()
@QueryHandler(GetVerifiersQuery)
export class GetVerifiersQueryHandler
  implements IQueryHandler<GetVerifiersQuery>
{
  constructor(private readonly verifiers: VerifiersReadPort) {}

  async execute(query: GetVerifiersQuery) {
    return this.verifiers.findAll(query.activeOnly);
  }
}
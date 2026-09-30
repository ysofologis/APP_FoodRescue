import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository } from '../../domain/repositories/verifier.repository';

export class ListVerificationsQuery {
  constructor(public readonly activeOnly: boolean = false) {}
}

@Injectable()
@QueryHandler(ListVerificationsQuery)
export class ListVerificationsQueryHandler
  implements IQueryHandler<ListVerificationsQuery, VerifierAggregate[]>
{
  constructor(private readonly verifiers: VerifierRepository) {}

  async execute(query: ListVerificationsQuery): Promise<VerifierAggregate[]> {
    return query.activeOnly
      ? this.verifiers.findActive()
      : this.verifiers.findAll();
  }
}
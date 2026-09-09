import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository as VerifierRepoInterface } from '../../domain/repositories/verifier.repository';

export class ListVerificationsQuery {
  constructor(public readonly activeOnly?: boolean) {}
}

@QueryHandler(ListVerificationsQuery)
export class ListVerificationsQueryHandler
  implements IQueryHandler<ListVerificationsQuery>
{
  constructor(
    @InjectRepository(VerifierAggregate)
    private readonly verifierRepo: Repository<VerifierAggregate>,
  ) {}

  async execute(query: ListVerificationsQuery): Promise<VerifierAggregate[]> {
    if (query.activeOnly) {
      return this.verifierRepo.find({ where: { active: true } });
    }
    return this.verifierRepo.find();
  }
}

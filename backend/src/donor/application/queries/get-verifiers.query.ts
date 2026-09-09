import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifierAggregate } from '../../trust/domain/aggregates/verifier.aggregate';
import { VerifierRepository as VerifierRepoInterface } from '../../trust/domain/repositories/verifier.repository';

export class GetVerifiersQuery {
  constructor(public readonly activeOnly?: boolean) {}
}

@QueryHandler(GetVerifiersQuery)
export class GetVerifiersQueryHandler
  implements IQueryHandler<GetVerifiersQuery>
{
  constructor(
    @InjectRepository(VerifierAggregate)
    private readonly verifierRepo: Repository<VerifierAggregate>,
  ) {}

  async execute(query: GetVerifiersQuery): Promise<VerifierAggregate[]> {
    if (query.activeOnly) {
      return this.verifierRepo.find({ where: { active: true } });
    }
    return this.verifierRepo.find();
  }
}

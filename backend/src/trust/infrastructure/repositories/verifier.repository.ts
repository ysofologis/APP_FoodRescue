import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifierAggregate } from '../../domain/aggregates/verifier.aggregate';
import { VerifierRepository as VerifierRepoPort } from '../../domain/repositories/verifier.repository';

@Injectable()
export class
VerifierRepositoryImpl extends VerifierRepoPort {
  constructor(
    @InjectRepository(VerifierAggregate)
    private readonly repo: Repository<VerifierAggregate>,
  ) {
    super();
  }

  async save(verifier: VerifierAggregate): Promise<void> {
    await this.repo.save(verifier);
  }

  async findById(id: string): Promise<VerifierAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<VerifierAggregate[]> {
    return this.repo.find();
  }

  async findActive(): Promise<VerifierAggregate[]> {
    return this.repo.find({ where: { active: true } });
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientAggregate } from '../../domain/aggregates/recipient.aggregate';
import { RecipientRepository as RecipientRepoPort } from '../../domain/repositories/recipient.repository';

@Injectable()
export class
RecipientRepositoryImpl extends RecipientRepoPort {
  constructor(
    @InjectRepository(RecipientAggregate)
    private readonly repo: Repository<RecipientAggregate>,
  ) {
    super();
  }

  async save(recipient: RecipientAggregate): Promise<void> {
    await this.repo.save(recipient);
  }

  async findById(id: string): Promise<RecipientAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<RecipientAggregate[]> {
    return this.repo.find();
  }

  async findVerified(): Promise<RecipientAggregate[]> {
    return this.repo.find({ where: { status: 'VERIFIED' } });
  }
}
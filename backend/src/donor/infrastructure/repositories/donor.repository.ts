import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorAggregate } from '../../domain/aggregates/donor.aggregate';
import { DonorRepository as DonorRepoPort } from '../../domain/repositories/donor.repository';

@Injectable()
export class
DonorRepositoryImpl extends DonorRepoPort {
  constructor(
    @InjectRepository(DonorAggregate)
    private readonly repo: Repository<DonorAggregate>,
  ) {
    super();
  }

  async save(donor: DonorAggregate): Promise<void> {
    await this.repo.save(donor);
  }

  async findById(id: string): Promise<DonorAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<DonorAggregate | null> {
    return this.repo.findOne({ where: { contactEmail: email } });
  }

  async findAll(): Promise<DonorAggregate[]> {
    return this.repo.find();
  }
}
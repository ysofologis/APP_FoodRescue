import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRunAggregate } from '../../domain/aggregates/distribution-run.aggregate';
import { DistributionRunRepository as DistributionRunRepoInterface } from '../../domain/repositories/distribution-run.repository';

@Injectable()
export class DistributionRunRepository implements DistributionRunRepoInterface {
  constructor(
    @InjectRepository(DistributionRunAggregate)
    private readonly repo: Repository<DistributionRunAggregate>,
  ) {}

  async save(run: DistributionRunAggregate): Promise<void> {
    await this.repo.save(run);
  }

  async findById(id: string): Promise<DistributionRunAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByDriverId(driverId: string): Promise<DistributionRunAggregate[]> {
    return this.repo.find({ where: { driverId } });
  }

  async findByStatus(status: string): Promise<DistributionRunAggregate[]> {
    return this.repo.find({ where: { status } });
  }
}

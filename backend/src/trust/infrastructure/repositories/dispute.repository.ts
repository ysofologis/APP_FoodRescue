import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisputeAggregate } from '../../domain/aggregates/dispute.aggregate';
import { DisputeRepository as DisputeRepoInterface } from '../../domain/repositories/dispute.repository';

@Injectable()
export class DisputeRepository implements DisputeRepoInterface {
  constructor(
    @InjectRepository(DisputeAggregate)
    private readonly repo: Repository<DisputeAggregate>,
  ) {}

  async save(dispute: DisputeAggregate): Promise<void> {
    await this.repo.save(dispute);
  }

  async findById(id: string): Promise<DisputeAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByListingId(listingId: string): Promise<DisputeAggregate[]> {
    return this.repo.find({ where: { listingId } });
  }

  async findOpen(): Promise<DisputeAggregate[]> {
    return this.repo.find({ where: { status: 'OPEN' } });
  }
}

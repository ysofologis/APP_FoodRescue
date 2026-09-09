import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository as FoodListingRepoInterface } from '../../domain/repositories/food-listing.repository';

@Injectable()
export class FoodListingRepository implements FoodListingRepoInterface {
  constructor(
    @InjectRepository(FoodListing)
    private readonly repo: Repository<FoodListing>,
  ) {}

  async save(listing: FoodListing): Promise<void> {
    await this.repo.save(listing);
  }

  async findById(id: string): Promise<FoodListing | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByDonorId(donorId: string): Promise<FoodListing[]> {
    return this.repo.find({ where: { donorId } });
  }

  async findAvailable(): Promise<FoodListing[]> {
    return this.repo.find({
      where: { status: 'AVAILABLE' },
      order: { pickupWindowStart: 'ASC' },
    });
  }

  async findByStatus(status: string): Promise<FoodListing[]> {
    return this.repo.find({ where: { status } });
  }
}

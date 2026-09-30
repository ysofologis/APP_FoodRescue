import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FoodCategory } from '../value-objects/food-category.vo';
import { Condition } from '../value-objects/condition.vo';
import { StorageRequirement } from '../value-objects/storage-requirement.vo';
import { Quantity } from '../value-objects/quantity.vo';
import { DonorAggregate } from './donor.aggregate';
import { FoodListingCreatedEvent } from '../events/food-listing-created.event';
import { FoodListingClaimedEvent } from '../events/food-listing-claimed.event';

@Entity('food_listings')
export class FoodListing {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-json' })
  category: FoodCategory;

  @Column({ type: 'simple-json' })
  quantity: Quantity;

  @Column({ type: 'simple-json' })
  condition: Condition;

  @Column({ type: 'simple-json' })
  storageRequirement: StorageRequirement;

  @Column({ type: 'varchar', length: 255, nullable: true })
  allergens?: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime' })
  pickupWindowStart: Date;

  @Column({ type: 'datetime' })
  pickupWindowEnd: Date;

  @Column({ type: 'varchar', length: 500 })
  pickupLocation: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photoUrl?: string;

  @Column({ type: 'varchar', length: 36 })
  donorId: string;

  @ManyToOne(() => DonorAggregate, (donor) => donor.listings)
  @JoinColumn({ name: 'donorId' })
  donor: DonorAggregate;

  @Column({ type: 'varchar', length: 20, default: 'AVAILABLE' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  claimedAt?: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  claimedBy?: string;

  static create(
    title: string,
    donorId: string,
    category: FoodCategory,
    quantity: Quantity,
    condition: Condition,
    storageRequirement: StorageRequirement,
    pickupWindowStart: Date,
    pickupWindowEnd: Date,
    pickupLocation: string,
    description?: string,
    allergens?: string,
    photoUrl?: string,
  ): [FoodListing, FoodListingCreatedEvent] {
    const listing = new FoodListing();
    listing.id = uuid();
    listing.title = title;
    listing.donorId = donorId;
    listing.category = category;
    listing.quantity = quantity;
    listing.condition = condition;
    listing.storageRequirement = storageRequirement;
    listing.description = description;
    listing.allergens = allergens;
    listing.photoUrl = photoUrl;
    listing.expiresAt = pickupWindowEnd;
    listing.pickupWindowStart = pickupWindowStart;
    listing.pickupWindowEnd = pickupWindowEnd;
    listing.pickupLocation = pickupLocation;
    listing.status = 'AVAILABLE';

    const event = new FoodListingCreatedEvent(
      listing.id,
      listing.title,
      listing.donorId,
      category,
      quantity,
    );
    return [listing, event];
  }

  claim(recipientId: string): [FoodListing, FoodListingClaimedEvent] {
    if (this.status !== 'AVAILABLE') {
      throw new Error(`Cannot claim listing in status: ${this.status}`);
    }
    if (new Date() > this.pickupWindowEnd) {
      throw new Error('Pickup window has expired');
    }
    this.status = 'CLAIMED';
    this.claimedAt = new Date();
    this.claimedBy = recipientId;

    const event = new FoodListingClaimedEvent(
      this.id,
      recipientId,
      this.claimedAt,
    );
    return [this, event];
  }

  confirmPickup(): void {
    if (this.status !== 'CLAIMED') {
      throw new Error('Listing must be claimed before pickup confirmation');
    }
    this.status = 'PICKED_UP';
  }

  completeDistribution(): void {
    if (this.status !== 'PICKED_UP') {
      throw new Error('Listing must be picked up before distribution completion');
    }
    this.status = 'DISTRIBUTED';
  }

  cancel(): void {
    if (this.status === 'DISTRIBUTED') {
      throw new Error('Cannot cancel a completed distribution');
    }
    this.status = 'CANCELLED';
  }
}

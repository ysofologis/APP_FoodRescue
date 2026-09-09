import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DonorCreatedEvent } from '../../domain/events/donor-created.event';
import { FoodListingCreatedEvent } from '../../domain/events/food-listing-created.event';
import { FoodListingClaimedEvent } from '../../domain/events/food-listing-claimed.event';

@Injectable()
export class DonorEventPublisher {
  constructor(private readonly emitter: EventEmitter2) {}

  publishDonorCreated(event: DonorCreatedEvent): void {
    this.emitter.emit('donor.created', event);
  }

  publishFoodListingCreated(event: FoodListingCreatedEvent): void {
    this.emitter.emit('food-listing.created', event);
  }

  publishFoodListingClaimed(event: FoodListingClaimedEvent): void {
    this.emitter.emit('food-listing.claimed', event);
  }
}

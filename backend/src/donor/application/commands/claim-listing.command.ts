import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';

export class ClaimListingCommand {
  constructor(
    public readonly listingId: string,
    public readonly recipientId: string,
  ) {}
}

@Injectable()
@CommandHandler(ClaimListingCommand)
export class ClaimListingCommandHandler
  implements ICommandHandler<ClaimListingCommand, FoodListing>
{
  constructor(
    private readonly listings: FoodListingRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: ClaimListingCommand): Promise<FoodListing> {
    const listing = await this.listings.findById(command.listingId);
    if (!listing) {
      throw new NotFoundException(
        `Food listing not found: ${command.listingId}`,
      );
    }

    // claim() throws on invariant violation (wrong status, expired window).
    // Domain rule, not a transport-layer concern — let it propagate.
    const [, event] = listing.claim(command.recipientId);
    await this.listings.save(listing);
    this.events.publish(event as object);
    return listing;
  }
}
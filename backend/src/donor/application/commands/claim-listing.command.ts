import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';
import { FoodListingClaimedEvent } from '../../domain/events/food-listing-claimed.event';
import { DonorEventPublisher } from '../../infrastructure/event-publishers/donor-event-publisher';

export class ClaimListingCommand {
  constructor(
    public readonly listingId: string,
    public readonly recipientId: string,
  ) {}
}

@CommandHandler(ClaimListingCommand)
export class ClaimListingCommandHandler
  implements ICommandHandler<ClaimListingCommand>
{
  constructor(
    @InjectRepository(FoodListing)
    private readonly listingRepo: Repository<FoodListing>,
    private readonly eventPublisher: DonorEventPublisher,
  ) {}

  async execute(command: ClaimListingCommand): Promise<FoodListing> {
    const listing = await this.listingRepo.findOne({
      where: { id: command.listingId },
    });

    if (!listing) {
      throw new Error(`Food listing not found: ${command.listingId}`);
    }

    listing.claim(command.recipientId);
    await this.listingRepo.save(listing);

    const event = new FoodListingClaimedEvent(
      listing.id,
      command.recipientId,
      new Date(),
    );
    this.eventPublisher.publishFoodListingClaimed(event);

    return listing;
  }
}

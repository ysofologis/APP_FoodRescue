import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';
import { DonorValidationService } from '../../domain/services/donor-validation.service';
import { FoodListingCreatedEvent } from '../../domain/events/food-listing-created.event';
import { DonorEventPublisher } from '../../infrastructure/event-publishers/donor-event-publisher';

export class CreateListingCommand {
  constructor(
    public readonly title: string,
    public readonly donorId: string,
    public readonly category: string,
    public readonly quantityValue: number,
    public readonly quantityUnit: string,
    public readonly condition: string,
    public readonly storageRequirement: string,
    public readonly pickupWindowStart: Date,
    public readonly pickupWindowEnd: Date,
    public readonly pickupLocation: string,
    public readonly description?: string,
    public readonly allergens?: string,
    public readonly photoUrl?: string,
  ) {}
}

@CommandHandler(CreateListingCommand)
export class CreateListingCommandHandler
  implements ICommandHandler<CreateListingCommand>
{
  constructor(
    @InjectRepository(FoodListing)
    private readonly listingRepo: Repository<FoodListing>,
    private readonly eventPublisher: DonorEventPublisher,
  ) {}

  async execute(command: CreateListingCommand): Promise<FoodListing> {
    DonorValidationService.validateListing(
      command.title,
      command.pickupWindowStart,
      command.pickupWindowEnd,
    );

    const [listing, event] = FoodListing.create(
      command.title,
      command.donorId,
      command.category as any,
      new (require('../../domain/value-objects/quantity.vo').Quantity)(
        command.quantityValue,
        command.quantityUnit,
      ),
      command.condition as any,
      command.storageRequirement as any,
      command.pickupWindowStart,
      command.pickupWindowEnd,
      command.pickupLocation,
      command.description,
      command.allergens,
      command.photoUrl,
    );

    await this.listingRepo.save(listing);
    this.eventPublisher.publishFoodListingCreated(event);

    return listing;
  }
}

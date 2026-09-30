import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { FoodListing } from '../../domain/aggregates/food-listing.aggregate';
import { FoodListingRepository } from '../../domain/repositories/food-listing.repository';
import { DonorValidationService } from '../../domain/services/donor-validation.service';
import { Quantity } from '../../domain/value-objects/quantity.vo';
import { FoodCategory } from '../../domain/value-objects/food-category.vo';
import { Condition } from '../../domain/value-objects/condition.vo';
import { StorageRequirement } from '../../domain/value-objects/storage-requirement.vo';

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

function parseEnum<T extends Record<string, string>>(
  enumType: T,
  raw: string,
  fieldName: string,
): T[keyof T] {
  const values = Object.values(enumType) as string[];
  if (!values.includes(raw)) {
    throw new BadRequestException(
      `Invalid ${fieldName}: ${raw}. Allowed: ${values.join(', ')}`,
    );
  }
  return raw as T[keyof T];
}

@Injectable()
@CommandHandler(CreateListingCommand)
export class CreateListingCommandHandler
  implements ICommandHandler<CreateListingCommand, FoodListing>
{
  constructor(
    private readonly listings: FoodListingRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: CreateListingCommand): Promise<FoodListing> {
    try {
      DonorValidationService.validateListing(
        command.title,
        command.pickupWindowStart,
        command.pickupWindowEnd,
      );
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Invalid listing',
      );
    }

    const quantity = new Quantity(command.quantityValue, command.quantityUnit);
    const category = parseEnum(FoodCategory, command.category, 'category');
    const condition = parseEnum(Condition, command.condition, 'condition');
    const storage = parseEnum(
      StorageRequirement,
      command.storageRequirement,
      'storageRequirement',
    );

    const [listing, event] = FoodListing.create(
      command.title,
      command.donorId,
      category,
      quantity,
      condition,
      storage,
      command.pickupWindowStart,
      command.pickupWindowEnd,
      command.pickupLocation,
      command.description,
      command.allergens,
      command.photoUrl,
    );

    await this.listings.save(listing);
    this.events.publish(event as object);
    return listing;
  }
}
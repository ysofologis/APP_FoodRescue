import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsDateString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { FoodCategory } from '../../domain/value-objects/food-category.vo';
import { Condition } from '../../domain/value-objects/condition.vo';
import { StorageRequirement } from '../../domain/value-objects/storage-requirement.vo';

export class CreateListingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string;

  /** UUID of the donor organization creating the listing. */
  @IsString()
  donorId!: string;

  @IsEnum(FoodCategory)
  category!: FoodCategory;

  @IsInt()
  @Min(1)
  quantityValue!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  quantityUnit!: string;

  @IsEnum(Condition)
  condition!: Condition;

  @IsEnum(StorageRequirement)
  storageRequirement!: StorageRequirement;

  @IsDateString()
  pickupWindowStart!: string;

  @IsDateString()
  pickupWindowEnd!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  pickupLocation!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  allergens?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(500)
  photoUrl?: string;
}
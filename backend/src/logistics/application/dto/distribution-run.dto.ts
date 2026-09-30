import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  IsDateString,
  ArrayMinSize,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateRunDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @IsUUID()
  driverId!: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  listingIds!: string[];

  @IsDateString()
  scheduledPickup!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  routeNotes?: string;
}

export class AssignDriverDto {
  @IsUUID()
  runId!: string;

  @IsUUID()
  driverId!: string;
}

export class ConfirmPickupDto {
  @IsUUID()
  runId!: string;
}

export class ConfirmDeliveryDto {
  @IsUUID()
  runId!: string;
}

export class CancelRunDto {
  @IsUUID()
  runId!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;
}
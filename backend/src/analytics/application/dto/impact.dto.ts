import {
  IsUUID,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  IsObject,
} from 'class-validator';

export class RecordImpactDto {
  @IsUUID()
  donorId!: string;

  @IsUUID()
  recipientId!: string;

  @IsInt()
  @Min(0)
  mealsSaved!: number;

  @IsNumber()
  @Min(0)
  co2KgAvoided!: number;

  @IsNumber()
  @Min(0)
  kgDelivered!: number;

  @IsOptional()
  @IsObject()
  nutritionalSummary?: Record<string, unknown>;
}

export class GetImpactReportQueryDto {
  @IsOptional()
  @IsUUID()
  donorId?: string;

  @IsOptional()
  @IsUUID()
  recipientId?: string;
}
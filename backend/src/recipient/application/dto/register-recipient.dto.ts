import {
  IsEmail,
  IsOptional,
  IsString,
  IsArray,
  ArrayMaxSize,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRecipientDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  orgType!: string;

  @IsEmail()
  @MaxLength(255)
  contactEmail!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  legalDocsRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  dietaryRestrictions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  preferredCategories?: string[];
}
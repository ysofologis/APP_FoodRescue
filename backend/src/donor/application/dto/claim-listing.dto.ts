import { IsString, IsUUID } from 'class-validator';

export class ClaimListingDto {
  @IsUUID()
  listingId!: string;

  @IsUUID()
  recipientId!: string;
}
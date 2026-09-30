import { Exclude, Expose } from 'class-transformer';
import { RecipientLookup } from '../ports/recipient-lookup.port';

@Exclude()
export class RecipientLookupResponseDto implements RecipientLookup {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  contactEmail?: string;

  @Expose()
  contactPhone?: string;

  @Expose()
  status!: string;

  static fromLookup(lookup: RecipientLookup): RecipientLookupResponseDto {
    return Object.assign(new RecipientLookupResponseDto(), lookup);
  }
}
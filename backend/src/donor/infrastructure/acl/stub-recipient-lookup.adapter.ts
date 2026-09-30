import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  RecipientLookup,
  RecipientLookupPort,
} from '../../application/ports/recipient-lookup.port';

/**
 * Stub: see stub-impact-read.adapter.ts. The real implementation will
 * read from `RecipientRepository` in the recipient context.
 */
@Injectable()
export class StubRecipientLookupAdapter implements RecipientLookupPort {
  async findById(recipientId: string): Promise<RecipientLookup | null> {
    throw new NotImplementedException(
      `Recipient lookup for ${recipientId}: pending ACL wiring from recipient context`,
    );
  }
}
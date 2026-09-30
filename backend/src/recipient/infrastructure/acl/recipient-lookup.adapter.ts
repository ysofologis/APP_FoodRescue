import { Injectable } from '@nestjs/common';
import {
  RecipientLookup,
  RecipientLookupPort,
} from '../../../donor/application/ports/recipient-lookup.port';
import { RecipientRepository } from '../repositories/recipient.repository';

@Injectable()
export class RecipientContextLookupAdapter implements RecipientLookupPort {
  constructor(private readonly recipients: RecipientRepository) {}

  async findById(recipientId: string): Promise<RecipientLookup | null> {
    const r = await this.recipients.findById(recipientId);
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      contactEmail: r.contactEmail,
      contactPhone: r.contactPhone,
      status: r.status,
    };
  }
}
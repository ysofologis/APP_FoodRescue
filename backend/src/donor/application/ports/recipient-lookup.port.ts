/**
 * Anti-corruption layer: donor may need to render recipient info on a
 * claimed listing (e.g. contact details for handoff). Defined as a port
 * so donor never imports recipient aggregates.
 */

export interface RecipientLookup {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  status: string;
}

export interface RecipientLookupPort {
  findById(recipientId: string): Promise<RecipientLookup | null>;
}
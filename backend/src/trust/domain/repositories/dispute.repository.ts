import { DisputeAggregate } from '../aggregates/dispute.aggregate';

export abstract class DisputeRepository {
  abstract save(dispute: DisputeAggregate): Promise<void>;
  abstract findById(id: string): Promise<DisputeAggregate | null>;
  abstract findByListingId(listingId: string): Promise<DisputeAggregate[]>;
  abstract findOpen(): Promise<DisputeAggregate[]>;
}
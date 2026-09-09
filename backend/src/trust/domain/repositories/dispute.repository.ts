import { DisputeAggregate } from '../aggregates/dispute.aggregate';

export interface DisputeRepository {
  save(dispute: DisputeAggregate): Promise<void>;
  findById(id: string): Promise<DisputeAggregate | null>;
  findByListingId(listingId: string): Promise<DisputeAggregate[]>;
  findOpen(): Promise<DisputeAggregate[]>;
}

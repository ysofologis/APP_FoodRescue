import { DonorAggregate } from '../aggregates/donor.aggregate';

export abstract class DonorRepository {
  abstract save(donor: DonorAggregate): Promise<void>;
  abstract findById(id: string): Promise<DonorAggregate | null>;
  abstract findByEmail(email: string): Promise<DonorAggregate | null>;
  abstract findAll(): Promise<DonorAggregate[]>;
}
import { DonorAggregate } from '../aggregates/donor.aggregate';

export interface DonorRepository {
  save(donor: DonorAggregate): Promise<void>;
  findById(id: string): Promise<DonorAggregate | null>;
  findByEmail(email: string): Promise<DonorAggregate | null>;
  findAll(): Promise<DonorAggregate[]>;
}

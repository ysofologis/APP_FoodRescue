import { VerifierAggregate } from '../aggregates/verifier.aggregate';

export interface VerifierRepository {
  save(verifier: VerifierAggregate): Promise<void>;
  findById(id: string): Promise<VerifierAggregate | null>;
  findAll(): Promise<VerifierAggregate[]>;
  findActive(): Promise<VerifierAggregate[]>;
}

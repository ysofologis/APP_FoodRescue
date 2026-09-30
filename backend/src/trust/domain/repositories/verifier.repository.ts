import { VerifierAggregate } from '../aggregates/verifier.aggregate';

export abstract class VerifierRepository {
  abstract save(verifier: VerifierAggregate): Promise<void>;
  abstract findById(id: string): Promise<VerifierAggregate | null>;
  abstract findAll(): Promise<VerifierAggregate[]>;
  abstract findActive(): Promise<VerifierAggregate[]>;
}
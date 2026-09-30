import { RecipientAggregate } from '../aggregates/recipient.aggregate';

export abstract class RecipientRepository {
  abstract save(recipient: RecipientAggregate): Promise<void>;
  abstract findById(id: string): Promise<RecipientAggregate | null>;
  abstract findAll(): Promise<RecipientAggregate[]>;
  abstract findVerified(): Promise<RecipientAggregate[]>;
}
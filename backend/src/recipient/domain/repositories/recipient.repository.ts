import { RecipientAggregate } from '../aggregates/recipient.aggregate';

export interface RecipientRepository {
  save(recipient: RecipientAggregate): Promise<void>;
  findById(id: string): Promise<RecipientAggregate | null>;
  findAll(): Promise<RecipientAggregate[]>;
  findVerified(): Promise<RecipientAggregate[]>;
}

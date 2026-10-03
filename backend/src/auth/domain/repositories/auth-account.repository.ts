import { AuthAccountAggregate } from '../aggregates/auth-account.aggregate';

export abstract class AuthAccountRepository {
  abstract save(account: AuthAccountAggregate): Promise<void>;
  abstract findById(id: string): Promise<AuthAccountAggregate | null>;
  abstract findByEmail(email: string): Promise<AuthAccountAggregate | null>;
  abstract findByLinkedId(
    linkedId: string,
  ): Promise<AuthAccountAggregate | null>;
  abstract findByRole(role: string): Promise<AuthAccountAggregate[]>;
}
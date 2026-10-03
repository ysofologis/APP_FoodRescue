import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthAccountAggregate } from '../../domain/aggregates/auth-account.aggregate';
import { AuthAccountRepository as AuthAccountRepoPort } from '../../domain/repositories/auth-account.repository';

@Injectable()
export class AuthAccountRepositoryImpl extends AuthAccountRepoPort {
  constructor(
    @InjectRepository(AuthAccountAggregate)
    private readonly repo: Repository<AuthAccountAggregate>,
  ) {
    super();
  }

  async save(account: AuthAccountAggregate): Promise<void> {
    await this.repo.save(account);
  }

  async findById(id: string): Promise<AuthAccountAggregate | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<AuthAccountAggregate | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByLinkedId(
    linkedId: string,
  ): Promise<AuthAccountAggregate | null> {
    return this.repo.findOne({ where: { linkedId } });
  }

  async findByRole(role: string): Promise<AuthAccountAggregate[]> {
    return this.repo.find({ where: { role: role as AuthAccountAggregate['role'] } });
  }
}
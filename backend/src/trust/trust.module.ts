import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@typeorm/sqlite';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { VerifierAggregate } from './domain/aggregates/verifier.aggregate';
import { VerifierRepository } from './infrastructure/repositories/verifier.repository';
import { VerifyOrganizationCommandHandler } from './application/commands/verify-organization.command';
import { ListVerificationsQueryHandler } from './application/queries/list-verifications.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerifierAggregate]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    VerifierRepository,
    VerifyOrganizationCommandHandler,
    ListVerificationsQueryHandler,
  ],
  exports: [VerifierRepository],
})
export class TrustModule {}

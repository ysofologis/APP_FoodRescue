import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import {
  VerifierAggregate,
  VerifierAuditEntry,
} from './domain/aggregates/verifier.aggregate';
import { DisputeAggregate } from './domain/aggregates/dispute.aggregate';
import { VerifierRepository } from './infrastructure/repositories/verifier.repository';
import { DisputeRepository } from './infrastructure/repositories/dispute.repository';
import { TrustVerifiersReadAdapter } from './infrastructure/acl/verifiers-read.adapter';
import { VerifyOrganizationCommandHandler } from './application/commands/verify-organization.command';
import { ResolveDisputeCommandHandler } from './application/commands/resolve-dispute.command';
import { BlacklistOrganizationCommandHandler } from './application/commands/blacklist-organization.command';
import { ListVerificationsQueryHandler } from './application/queries/list-verifications.query';
import { ListDisputesQueryHandler } from './application/queries/list-disputes.query';
import { TrustController } from './presentation/trust.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VerifierAggregate,
      VerifierAuditEntry,
      DisputeAggregate,
    ]),
    CqrsModule,
  ],
  controllers: [TrustController],
  providers: [
    VerifierRepository,
    DisputeRepository,
    TrustVerifiersReadAdapter,
    VerifyOrganizationCommandHandler,
    ResolveDisputeCommandHandler,
    BlacklistOrganizationCommandHandler,
    ListVerificationsQueryHandler,
    ListDisputesQueryHandler,
  ],
  exports: [
    VerifierRepository,
    DisputeRepository,
    TrustVerifiersReadAdapter,
  ],
})
export class TrustModule {}
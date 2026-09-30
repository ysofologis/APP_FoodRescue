import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { RecipientAggregate } from './domain/aggregates/recipient.aggregate';
import { RecipientRepository } from './infrastructure/repositories/recipient.repository';
import { RecipientContextLookupAdapter } from './infrastructure/acl/recipient-lookup.adapter';
import { RegisterRecipientCommandHandler } from './application/commands/register-recipient.command';
import { ListRecipientsQueryHandler } from './application/queries/list-recipients.query';
import { RecipientsController } from './presentation/recipients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientAggregate]), CqrsModule],
  controllers: [RecipientsController],
  providers: [
    RecipientRepository,
    RecipientContextLookupAdapter,
    RegisterRecipientCommandHandler,
    ListRecipientsQueryHandler,
  ],
  exports: [RecipientRepository, RecipientContextLookupAdapter],
})
export class RecipientModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { RecipientAggregate } from './domain/aggregates/recipient.aggregate';
import { RecipientRepository } from './domain/repositories/recipient.repository';
import { RecipientRepositoryImpl } from './infrastructure/repositories/recipient.repository';
import { RecipientContextLookupAdapter } from './infrastructure/acl/recipient-lookup.adapter';
import { RegisterRecipientCommandHandler } from './application/commands/register-recipient.command';
import { ListRecipientsQueryHandler } from './application/queries/list-recipients.query';
import { RecipientsController } from './presentation/recipients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientAggregate]), CqrsModule],
  providers: [
    { provide: RecipientRepository, useClass: RecipientRepositoryImpl },
    RecipientContextLookupAdapter,
    RegisterRecipientCommandHandler,
    ListRecipientsQueryHandler,
  ],
  controllers: [RecipientsController],
  exports: [RecipientRepository, RecipientContextLookupAdapter],
})
export class RecipientModule {}
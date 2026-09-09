import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@typeorm/sqlite';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { RecipientAggregate } from './domain/aggregates/recipient.aggregate';
import { RecipientRepository } from './infrastructure/repositories/recipient.repository';
import { RegisterRecipientCommandHandler } from './application/commands/register-recipient.command';
import { ListRecipientsQueryHandler } from './application/queries/list-recipients.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipientAggregate]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    RecipientRepository,
    RegisterRecipientCommandHandler,
    ListRecipientsQueryHandler,
  ],
  exports: [RecipientRepository],
})
export class RecipientModule {}

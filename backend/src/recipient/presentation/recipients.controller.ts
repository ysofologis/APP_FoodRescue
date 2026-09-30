import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  RegisterRecipientDto,
  RecipientResponseDto,
} from '../application/dto';

import { RegisterRecipientCommand } from '../application/commands/register-recipient.command';
import { ListRecipientsQuery } from '../application/queries/list-recipients.query';
import { RecipientAggregate } from '../domain/aggregates/recipient.aggregate';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('recipients')
export class RecipientsController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterRecipientDto,
  ): Promise<RecipientResponseDto> {
    const recipient = await this.commands.execute<
      RegisterRecipientCommand,
      RecipientAggregate
    >(
      new RegisterRecipientCommand(
        dto.name,
        dto.orgType,
        dto.contactEmail,
        dto.legalDocsRef,
        dto.contactPhone,
        dto.address,
      ),
    );
    return RecipientResponseDto.fromAggregate(recipient);
  }

  @Get()
  async list(
    @Query('verifiedOnly') verifiedOnly?: string,
  ): Promise<RecipientResponseDto[]> {
    const recipients = await this.queries.execute(
      new ListRecipientsQuery(verifiedOnly === 'true'),
    );
    return recipients.map(RecipientResponseDto.fromAggregate);
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RecipientResponseDto> {
    const recipients = await this.queries.execute(
      new ListRecipientsQuery(false),
    );
    const found = recipients.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundException(`Recipient not found: ${id}`);
    }
    return RecipientResponseDto.fromAggregate(found);
  }
}
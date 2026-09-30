import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  AssignDriverDto,
  CancelRunDto,
  ConfirmDeliveryDto,
  ConfirmPickupDto,
  CreateRunDto,
  DistributionRunResponseDto,
} from '../application/dto';

import { AssignDriverCommand } from '../application/commands/assign-driver.command';
import { ConfirmPickupCommand } from '../application/commands/confirm-pickup.command';
import { ConfirmDeliveryCommand } from '../application/commands/confirm-delivery.command';
import { CancelRunCommand } from '../application/commands/cancel-run.command';
import { ListDistributionRunsQuery } from '../application/queries/list-distribution-runs.query';
import { CreateRunCommand } from '../application/commands/create-run.command';
import { DistributionRunAggregate } from '../domain/aggregates/distribution-run.aggregate';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('distribution-runs')
export class DistributionRunsController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateRunDto,
  ): Promise<DistributionRunResponseDto> {
    const run = await this.commands.execute<
      CreateRunCommand,
      DistributionRunAggregate
    >(
      new CreateRunCommand(
        dto.name,
        dto.driverId,
        dto.listingIds,
        new Date(dto.scheduledPickup),
        dto.routeNotes,
      ),
    );
    return DistributionRunResponseDto.fromAggregate(run);
  }

  @Post(':id/assign-driver')
  @HttpCode(HttpStatus.OK)
  async assignDriver(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignDriverDto,
  ): Promise<DistributionRunResponseDto> {
    const run = await this.commands.execute<
      AssignDriverCommand,
      DistributionRunAggregate
    >(new AssignDriverCommand(id, dto.driverId));
    return DistributionRunResponseDto.fromAggregate(run);
  }

  @Post(':id/confirm-pickup')
  @HttpCode(HttpStatus.OK)
  async confirmPickup(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() _dto: ConfirmPickupDto,
  ): Promise<DistributionRunResponseDto> {
    const run = await this.commands.execute<
      ConfirmPickupCommand,
      DistributionRunAggregate
    >(new ConfirmPickupCommand(id));
    return DistributionRunResponseDto.fromAggregate(run);
  }

  @Post(':id/confirm-delivery')
  @HttpCode(HttpStatus.OK)
  async confirmDelivery(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() _dto: ConfirmDeliveryDto,
  ): Promise<DistributionRunResponseDto> {
    const run = await this.commands.execute<
      ConfirmDeliveryCommand,
      DistributionRunAggregate
    >(new ConfirmDeliveryCommand(id));
    return DistributionRunResponseDto.fromAggregate(run);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CancelRunDto,
  ): Promise<DistributionRunResponseDto> {
    const run = await this.commands.execute<
      CancelRunCommand,
      DistributionRunAggregate
    >(new CancelRunCommand(id, dto.reason));
    return DistributionRunResponseDto.fromAggregate(run);
  }

  @Get()
  async list(
    @Query('driverId') driverId?: string,
    @Query('status') status?: string,
  ): Promise<DistributionRunResponseDto[]> {
    const runs = await this.queries.execute(
      new ListDistributionRunsQuery(driverId, status),
    );
    return runs.map(DistributionRunResponseDto.fromAggregate);
  }
}
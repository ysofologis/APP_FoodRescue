import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  AggregateImpactResponseDto,
  GetImpactReportQueryDto,
  ImpactMetricResponseDto,
  RecordImpactDto,
} from '../application/dto';

import { RecordImpactCommand } from '../application/commands/record-impact.command';
import { GetImpactReportQuery } from '../application/queries/get-impact-report.query';
import { ImpactMetricAggregate } from '../domain/aggregates/impact-metric.aggregate';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller()
export class AnalyticsController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  @Post('impact')
  @HttpCode(HttpStatus.CREATED)
  async record(@Body() dto: RecordImpactDto): Promise<ImpactMetricResponseDto> {
    const metric = await this.commands.execute<
      RecordImpactCommand,
      ImpactMetricAggregate
    >(
      new RecordImpactCommand(
        dto.donorId,
        dto.recipientId,
        dto.mealsSaved,
        dto.co2KgAvoided,
        dto.kgDelivered,
        dto.nutritionalSummary,
      ),
    );
    return ImpactMetricResponseDto.fromAggregate(metric);
  }

  @Get('impact/report')
  async report(
    @Query() query: GetImpactReportQueryDto,
  ): Promise<{
    metrics: ImpactMetricResponseDto[];
    aggregate: AggregateImpactResponseDto;
  }> {
    const result = await this.queries.execute(
      new GetImpactReportQuery(query.donorId, query.recipientId),
    );
    return {
      metrics: result.metrics.map(ImpactMetricResponseDto.fromAggregate),
      aggregate: AggregateImpactResponseDto.fromAggregate(result.aggregate),
    };
  }
}
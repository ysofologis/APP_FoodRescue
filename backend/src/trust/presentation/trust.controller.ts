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
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';

import {
  BlacklistOrganizationDto,
  DisputeResponseDto,
  ResolveDisputeDto,
  VerifierResponseDto,
  VerifyOrganizationDto,
} from '../application/dto';

import { VerifyOrganizationCommand } from '../application/commands/verify-organization.command';
import { ResolveDisputeCommand } from '../application/commands/resolve-dispute.command';
import { BlacklistOrganizationCommand } from '../application/commands/blacklist-organization.command';
import { ListVerificationsQuery } from '../application/queries/list-verifications.query';
import { ListDisputesQuery } from '../application/queries/list-disputes.query';

import { VerifierAggregate } from '../domain/aggregates/verifier.aggregate';
import { DisputeAggregate } from '../domain/aggregates/dispute.aggregate';

import { JwtAuthGuard } from '../../auth/presentation/jwt-auth.guard';
import { RolesGuard } from '../../auth/presentation/roles.guard';
import { Roles } from '../../auth/presentation/roles.decorator';
import { Role } from '../../auth/domain/value-objects/role.vo';
import { JwtPayload } from '../../auth/application/ports/token-issuer.port';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller()
export class TrustController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  @Post('verifications')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VERIFIER, Role.ADMIN)
  async verifyOrganization(
    @Body() dto: VerifyOrganizationDto,
    @Req() req: Request & { user?: JwtPayload },
  ): Promise<VerifierResponseDto> {
    const verifierId = req.user?.linkedId;
    if (!verifierId) {
      throw new Error('Authenticated verifier id missing from token');
    }
    const verifier = await this.commands.execute<
      VerifyOrganizationCommand,
      VerifierAggregate
    >(
      new VerifyOrganizationCommand(
        verifierId,
        dto.organizationId,
        dto.organizationType,
        dto.notes,
      ),
    );
    return VerifierResponseDto.fromAggregate(verifier);
  }

  @Post('verifications/blacklist')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VERIFIER, Role.ADMIN)
  async blacklistOrganization(
    @Body() dto: BlacklistOrganizationDto,
    @Req() req: Request & { user?: JwtPayload },
  ): Promise<VerifierResponseDto> {
    const verifierId = req.user?.linkedId;
    if (!verifierId) {
      throw new Error('Authenticated verifier id missing from token');
    }
    const updated = await this.commands.execute<
      BlacklistOrganizationCommand,
      VerifierAggregate
    >(
      new BlacklistOrganizationCommand(
        verifierId,
        dto.organizationId,
        'DONOR', // explicit in DTO future iteration; defaulted for now
        dto.reason,
      ),
    );
    return VerifierResponseDto.fromAggregate(updated);
  }

  @Get('verifiers')
  async listVerifiers(
    @Query('activeOnly') activeOnly?: string,
  ): Promise<VerifierResponseDto[]> {
    const verifiers = await this.queries.execute(
      new ListVerificationsQuery(activeOnly === 'true'),
    );
    return verifiers.map(VerifierResponseDto.fromAggregate);
  }

  @Post('disputes/:id/resolve')
  @HttpCode(HttpStatus.OK)
  async resolveDispute(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ResolveDisputeDto,
  ): Promise<DisputeResponseDto> {
    const dispute = await this.commands.execute<
      ResolveDisputeCommand,
      DisputeAggregate
    >(new ResolveDisputeCommand(id, dto.resolvedBy, dto.resolution));
    return DisputeResponseDto.fromAggregate(dispute);
  }

  @Get('disputes')
  async listDisputes(
    @Query('openOnly') openOnly?: string,
    @Query('listingId') listingId?: string,
  ): Promise<DisputeResponseDto[]> {
    const disputes = await this.queries.execute(
      new ListDisputesQuery(openOnly !== 'false', listingId),
    );
    return disputes.map(DisputeResponseDto.fromAggregate);
  }
}
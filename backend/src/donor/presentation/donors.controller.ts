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
  ClaimListingDto,
  CreateListingDto,
  DonorImpactResponseDto,
  DonorResponseDto,
  DriverRunsResponseDto,
  ListingResponseDto,
  PublicImpactResponseDto,
  RecipientImpactResponseDto,
  RecipientLookupResponseDto,
  RegisterDonorDto,
  VerifierResponseDto,
} from '../application/dto';

import { RegisterDonorCommand } from '../application/commands/register-donor.command';
import { CreateListingCommand } from '../application/commands/create-listing.command';
import { ClaimListingCommand } from '../application/commands/claim-listing.command';

import { GetDonorByIdQuery } from '../application/queries/get-donor-by-id.query';
import { GetListingByIdQuery } from '../application/queries/get-listing-by-id.query';
import { ListDonorListingsQuery } from '../application/queries/list-donor-listings.query';
import { ListAllListingsQuery } from '../application/queries/list-all-listings.query';
import { GetDonorImpactQuery } from '../application/queries/get-donor-impact.query';
import { GetImpactDashboardQuery } from '../application/queries/get-impact-dashboard.query';
import { GetPublicImpactQuery } from '../application/queries/get-public-impact.query';
import { GetRecipientImpactQuery } from '../application/queries/get-recipient-impact.query';
import { GetRecipientByIdQuery } from '../application/queries/get-recipient-by-id.query';
import { GetDriverRunsQuery } from '../application/queries/get-driver-runs.query';
import { GetVerifiersQuery } from '../application/queries/get-verifiers.query';

import { DonorAggregate } from '../domain/aggregates/donor.aggregate';
import { FoodListing } from '../domain/aggregates/food-listing.aggregate';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
  }),
)
@Controller()
export class DonorsController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  // ── Donors ────────────────────────────────────────────────────────────

  @Post('donors')
  async register(@Body() dto: RegisterDonorDto): Promise<DonorResponseDto> {
    const donor = await this.commands.execute<RegisterDonorCommand, DonorAggregate>(
      new RegisterDonorCommand(
        dto.name,
        dto.contactEmail,
        dto.businessLicense,
        dto.contactPhone,
        dto.address,
      ),
    );
    return DonorResponseDto.fromAggregate(donor);
  }

  @Get('donors/:id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DonorResponseDto> {
    const donor = await this.queries.execute(
      new GetDonorByIdQuery(id),
    );
    if (!donor) {
      throw new NotFoundException(`Donor not found: ${id}`);
    }
    return DonorResponseDto.fromAggregate(donor);
  }

  // ── Listings ──────────────────────────────────────────────────────────

  @Post('listings')
  @HttpCode(HttpStatus.CREATED)
  async createListing(
    @Body() dto: CreateListingDto,
  ): Promise<ListingResponseDto> {
    const listing = await this.commands.execute<CreateListingCommand, FoodListing>(
      new CreateListingCommand(
        dto.title,
        dto.donorId,
        dto.category,
        dto.quantityValue,
        dto.quantityUnit,
        dto.condition,
        dto.storageRequirement,
        new Date(dto.pickupWindowStart),
        new Date(dto.pickupWindowEnd),
        dto.pickupLocation,
        dto.description,
        dto.allergens,
        dto.photoUrl,
      ),
    );
    return ListingResponseDto.fromAggregate(listing);
  }

  @Get('listings/:id')
  async getListingById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ListingResponseDto> {
    const listing = await this.queries.execute(new GetListingByIdQuery(id));
    if (!listing) {
      throw new NotFoundException(`Listing not found: ${id}`);
    }
    return ListingResponseDto.fromAggregate(listing);
  }

  @Get('listings')
  async listListings(
    @Query('status') status?: string,
    @Query('donorId') donorId?: string,
  ): Promise<ListingResponseDto[]> {
    if (donorId) {
      const listings = await this.queries.execute(
        new ListDonorListingsQuery(donorId),
      );
      return listings.map(ListingResponseDto.fromAggregate);
    }
    const listings = await this.queries.execute(
      new ListAllListingsQuery(status),
    );
    return listings.map(ListingResponseDto.fromAggregate);
  }

  @Post('listings/:id/claim')
  @HttpCode(HttpStatus.OK)
  async claimListing(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ClaimListingDto,
  ): Promise<ListingResponseDto> {
    const listing = await this.commands.execute<ClaimListingCommand, FoodListing>(
      new ClaimListingCommand(id, dto.recipientId),
    );
    return ListingResponseDto.fromAggregate(listing);
  }

  // ── Cross-context reads via ACL ports ────────────────────────────────

  @Get('donors/:id/impact')
  async getDonorImpact(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DonorImpactResponseDto> {
    const summary = await this.queries.execute(new GetDonorImpactQuery(id));
    return DonorImpactResponseDto.fromSummary(summary);
  }

  @Get('donors/:id/dashboard')
  async getDonorDashboard(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DonorImpactResponseDto> {
    const summary = await this.queries.execute(
      new GetImpactDashboardQuery(id),
    );
    return DonorImpactResponseDto.fromSummary(summary);
  }

  @Get('recipients/:id/impact')
  async getRecipientImpact(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RecipientImpactResponseDto> {
    const summary = await this.queries.execute(
      new GetRecipientImpactQuery(id),
    );
    return RecipientImpactResponseDto.fromSummary(summary);
  }

  @Get('impact/public')
  async getPublicImpact(): Promise<PublicImpactResponseDto> {
    const summary = await this.queries.execute(new GetPublicImpactQuery());
    return PublicImpactResponseDto.fromSummary(summary);
  }

  @Get('recipients/:id')
  async getRecipientById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RecipientLookupResponseDto> {
    const lookup = await this.queries.execute(new GetRecipientByIdQuery(id));
    if (!lookup) {
      throw new NotFoundException(`Recipient not found: ${id}`);
    }
    return RecipientLookupResponseDto.fromLookup(lookup);
  }

  @Get('drivers/:id/runs')
  async getDriverRuns(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DriverRunsResponseDto> {
    const summaries = await this.queries.execute(new GetDriverRunsQuery(id));
    return DriverRunsResponseDto.fromSummaries(id, summaries);
  }

  @Get('verifiers')
  async getVerifiers(
    @Query('activeOnly') activeOnly?: string,
  ): Promise<VerifierResponseDto[]> {
    const summaries = await this.queries.execute(
      new GetVerifiersQuery(activeOnly === 'true'),
    );
    return summaries.map(VerifierResponseDto.fromSummary);
  }
}
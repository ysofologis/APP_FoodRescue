import { Exclude, Expose } from 'class-transformer';
import { DriverRunSummary } from '../ports/driver-runs-read.port';

@Exclude()
export class DriverRunResponseDto implements DriverRunSummary {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  driverId!: string;

  @Expose()
  listingIds!: string[];

  @Expose()
  scheduledPickup!: Date;

  @Expose()
  status!: string;

  static fromSummary(summary: DriverRunSummary): DriverRunResponseDto {
    return Object.assign(new DriverRunResponseDto(), summary);
  }
}

@Exclude()
export class DriverRunsResponseDto {
  @Expose()
  driverId!: string;

  @Expose()
  runs!: DriverRunResponseDto[];

  static fromSummaries(
    driverId: string,
    summaries: DriverRunSummary[],
  ): DriverRunsResponseDto {
    const dto = new DriverRunsResponseDto();
    dto.driverId = driverId;
    dto.runs = summaries.map(DriverRunResponseDto.fromSummary);
    return dto;
  }
}
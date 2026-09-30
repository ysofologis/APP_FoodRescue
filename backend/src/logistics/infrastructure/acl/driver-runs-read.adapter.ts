import { Inject, Injectable } from '@nestjs/common';
import {
  DriverRunSummary,
  DriverRunsReadPort,
} from '../../../donor/application/ports/driver-runs-read.port';
import { DistributionRunRepository } from '../../domain/repositories/distribution-run.repository';

@Injectable()
export class LogisticsDriverRunsReadAdapter implements DriverRunsReadPort {
  constructor(
    @Inject(DistributionRunRepository)
    private readonly runs: DistributionRunRepository,
  ) {}

  async findByDriverId(driverId: string): Promise<DriverRunSummary[]> {
    const runs = await this.runs.findByDriverId(driverId);
    return runs.map((r) => ({
      id: r.id,
      name: r.name,
      driverId: r.driverId,
      listingIds: r.listingIds ?? [],
      scheduledPickup: r.scheduledPickup,
      status: r.status,
    }));
  }
}
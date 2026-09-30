import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  DonorImpactSummary,
  ImpactReadPort,
} from '../../application/ports/impact-read.port';

/**
 * Stub: will be replaced by an analytics-context implementation that
 * reads from `ImpactMetricRepository`. Throwing now keeps the donor
 * module honest about the missing wiring rather than silently returning
 * zeros.
 */
@Injectable()
export class StubImpactReadAdapter implements ImpactReadPort {
  async getDonorImpact(donorId: string): Promise<DonorImpactSummary> {
    throw new NotImplementedException(
      `Donor impact read for ${donorId}: pending ACL wiring from analytics context`,
    );
  }
}
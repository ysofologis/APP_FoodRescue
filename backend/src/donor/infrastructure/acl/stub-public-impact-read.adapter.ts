import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  PublicImpactReadPort,
  PublicImpactSummary,
} from '../../application/ports/public-impact-read.port';

/**
 * Stub: see stub-impact-read.adapter.ts.
 */
@Injectable()
export class StubPublicImpactReadAdapter implements PublicImpactReadPort {
  async getPublicImpact(): Promise<PublicImpactSummary> {
    throw new NotImplementedException(
      'Public impact read: pending ACL wiring from analytics context',
    );
  }
}
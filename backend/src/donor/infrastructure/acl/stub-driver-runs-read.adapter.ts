import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  DriverRunSummary,
  DriverRunsReadPort,
} from '../../application/ports/driver-runs-read.port';

@Injectable()
export class StubDriverRunsReadAdapter implements DriverRunsReadPort {
  async findByDriverId(driverId: string): Promise<DriverRunSummary[]> {
    throw new NotImplementedException(
      `Driver runs read for ${driverId}: pending ACL wiring from logistics context`,
    );
  }
}
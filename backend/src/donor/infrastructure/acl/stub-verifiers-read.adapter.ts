import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  VerifierSummary,
  VerifiersReadPort,
} from '../../application/ports/verifiers-read.port';

@Injectable()
export class StubVerifiersReadAdapter implements VerifiersReadPort {
  async findAll(activeOnly?: boolean): Promise<VerifierSummary[]> {
    throw new NotImplementedException(
      `Verifiers read: pending ACL wiring from trust context`,
    );
  }
}
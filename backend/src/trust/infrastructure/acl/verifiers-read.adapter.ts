import { Injectable } from '@nestjs/common';
import {
  VerifierSummary,
  VerifiersReadPort,
} from '../../../donor/application/ports/verifiers-read.port';
import { VerifierRepository } from '../repositories/verifier.repository';

@Injectable()
export class TrustVerifiersReadAdapter implements VerifiersReadPort {
  constructor(private readonly verifiers: VerifierRepository) {}

  async findAll(activeOnly?: boolean): Promise<VerifierSummary[]> {
    const verifiers = activeOnly
      ? await this.verifiers.findActive()
      : await this.verifiers.findAll();
    return verifiers.map((v) => ({
      id: v.id,
      name: v.name,
      role: v.role,
      active: v.active,
    }));
  }
}
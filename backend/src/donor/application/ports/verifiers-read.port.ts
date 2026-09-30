/**
 * Anti-corruption layer: trust context owns verifier data; donor surfaces
 * it via this abstract port.
 */

export interface VerifierSummary {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

export abstract class VerifiersReadPort {
  abstract findAll(activeOnly?: boolean): Promise<VerifierSummary[]>;
}
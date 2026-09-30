/**
 * Anti-corruption layer: trust context owns verifier data; donor
 * surfaces it via this port.
 */

export interface VerifierSummary {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

export interface VerifiersReadPort {
  findAll(activeOnly?: boolean): Promise<VerifierSummary[]>;
}
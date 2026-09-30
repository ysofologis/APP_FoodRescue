/**
 * Anti-corruption layer: donor defines its own read-side port for impact data
 * owned by the analytics context. The donor module never imports analytics
 * aggregates — it depends only on this abstract class.
 *
 * Abstract class (not interface) so NestJS DI can use it as a token —
 * interfaces are erased at compile time, abstract classes are not.
 *
 * The analytics module provides the concrete implementation, wired via
 * `{ provide: ImpactReadPort, useClass: AnalyticsImpactReadAdapter }` in
 * donor.module.ts.
 */

export interface DonorImpactSummary {
  donorId: string;
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export abstract class ImpactReadPort {
  abstract getDonorImpact(donorId: string): Promise<DonorImpactSummary>;
}
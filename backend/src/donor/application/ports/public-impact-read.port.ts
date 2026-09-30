/**
 * Anti-corruption layer: donor's public dashboard needs aggregate impact
 * numbers owned by the analytics context. Defined here so donor can query
 * without importing analytics aggregates.
 */

export interface PublicImpactSummary {
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export interface PublicImpactReadPort {
  getPublicImpact(): Promise<PublicImpactSummary>;
}
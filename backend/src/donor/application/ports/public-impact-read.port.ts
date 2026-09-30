/**
 * Anti-corruption layer: donor's public dashboard needs aggregate impact
 * numbers owned by the analytics context. Abstract class so NestJS DI
 * can use it as a token.
 */

export interface PublicImpactSummary {
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export abstract class PublicImpactReadPort {
  abstract getPublicImpact(): Promise<PublicImpactSummary>;
}
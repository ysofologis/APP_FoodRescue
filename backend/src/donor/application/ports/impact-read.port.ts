/**
 * Anti-corruption layer: donor defines its own read-side port for impact data
 * owned by the analytics context. The donor module never imports analytics
 * aggregates — it depends only on this interface.
 *
 * The analytics module will provide the concrete implementation, wired via
 * the donor module's providers list once the cross-context integration
 * pattern is chosen (event-driven projection, ACL service, or shared kernel).
 */

export interface DonorImpactSummary {
  donorId: string;
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export interface ImpactReadPort {
  getDonorImpact(donorId: string): Promise<DonorImpactSummary>;
}
/**
 * Anti-corruption layer: donor's recipient-impact view needs aggregate
 * data filtered by recipientId, which lives in the analytics context.
 *
 * Kept separate from ImpactReadPort so the analytics-side implementation
 * can route the right repository method (findByRecipientId vs findByDonorId).
 */
export interface RecipientImpactSummary {
  recipientId: string;
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export abstract class RecipientImpactReadPort {
  abstract getRecipientImpact(
    recipientId: string,
  ): Promise<RecipientImpactSummary>;
}
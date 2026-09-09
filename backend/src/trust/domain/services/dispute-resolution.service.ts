export class DisputeResolutionService {
  static validateResolution(
    disputeId: string,
    resolution: string,
    resolvedBy: string,
  ): void {
    if (!disputeId || disputeId.trim().length === 0) {
      throw new Error('Dispute ID is required');
    }
    if (!resolution || resolution.trim().length < 10) {
      throw new Error('Resolution must be at least 10 characters');
    }
    if (!resolvedBy || resolvedBy.trim().length === 0) {
      throw new Error('Resolver ID is required');
    }
  }
}

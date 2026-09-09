export class LogisticsValidationService {
  static validateDistributionRun(
    name: string,
    listingIds: string[],
    scheduledPickup: Date,
  ): void {
    if (!name || name.trim().length < 3) {
      throw new Error('Distribution run name must be at least 3 characters');
    }
    if (!listingIds || listingIds.length === 0) {
      throw new Error('At least one listing ID is required');
    }
    if (scheduledPickup <= new Date()) {
      throw new Error('Scheduled pickup must be in the future');
    }
  }
}

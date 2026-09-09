export class ListingValidationService {
  static validateListing(
    title: string,
    pickupWindowStart: Date,
    pickupWindowEnd: Date,
  ): void {
    if (!title || title.trim().length < 3) {
      throw new Error('Listing title must be at least 3 characters');
    }
    if (pickupWindowEnd <= pickupWindowStart) {
      throw new Error('Pickup window end must be after start');
    }
    if (pickupWindowStart <= new Date()) {
      throw new Error('Pickup window must start in the future');
    }
  }
}

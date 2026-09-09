export class DonorValidationService {
  static validateOnboarding(name: string, contactEmail: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Organization name must be at least 2 characters');
    }
    if (!contactEmail || !contactEmail.includes('@')) {
      throw new Error('Valid contact email is required');
    }
  }

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

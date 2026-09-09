export class RecipientValidationService {
  static validateRegistration(
    name: string,
    orgType: string,
    contactEmail: string,
  ): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Organization name must be at least 2 characters');
    }
    if (!orgType || orgType.trim().length === 0) {
      throw new Error('Organization type must not be empty');
    }
    if (!contactEmail || !contactEmail.includes('@')) {
      throw new Error('Valid contact email is required');
    }
  }
}

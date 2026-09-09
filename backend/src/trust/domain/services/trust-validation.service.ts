export class TrustValidationService {
  static validateVerification(
    verifierId: string,
    organizationId: string,
    organizationType: string,
  ): void {
    if (!verifierId || verifierId.trim().length === 0) {
      throw new Error('Verifier ID is required');
    }
    if (!organizationId || organizationId.trim().length === 0) {
      throw new Error('Organization ID is required');
    }
    if (!organizationType || organizationType.trim().length === 0) {
      throw new Error('Organization type is required');
    }
  }
}

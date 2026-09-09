export class AnalyticsValidationService {
  static validateImpactRecord(
    donorId: string,
    recipientId: string,
    mealsSaved: number,
    co2KgAvoided: number,
    kgDelivered: number,
  ): void {
    if (!donorId || !recipientId) {
      throw new Error('Donor and recipient IDs are required');
    }
    if (mealsSaved < 0) {
      throw new Error('Meals saved cannot be negative');
    }
    if (co2KgAvoided < 0) {
      throw new Error('CO2 avoided cannot be negative');
    }
    if (kgDelivered < 0) {
      throw new Error('KG delivered cannot be negative');
    }
  }
}

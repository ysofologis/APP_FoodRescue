export class Quantity {
  constructor(
    public readonly value: number,
    public readonly unit: string,
  ) {
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (!unit || unit.trim().length === 0) {
      throw new Error('Unit must not be empty');
    }
  }
}

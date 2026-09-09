export class Driver {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly vehicleType: string,
    public readonly available: boolean,
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Driver name must not be empty');
    }
    if (!vehicleType || vehicleType.trim().length === 0) {
      throw new Error('Vehicle type must not be empty');
    }
  }
}

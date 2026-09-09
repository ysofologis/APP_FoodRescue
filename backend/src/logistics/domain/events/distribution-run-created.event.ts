export class DistributionRunCreatedEvent {
  constructor(
    public readonly runId: string,
    public readonly name: string,
    public readonly driverId: string,
    public readonly listingIds: string[],
  ) {}
}

export class DeliveryCompletedEvent {
  constructor(
    public readonly runId: string,
    public readonly listingIds: string[],
    public readonly deliveredAt: Date,
  ) {}
}

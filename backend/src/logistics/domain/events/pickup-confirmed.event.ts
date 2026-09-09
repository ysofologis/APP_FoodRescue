export class PickupConfirmedEvent {
  constructor(
    public readonly runId: string,
    public readonly listingIds: string[],
    public readonly pickedUpAt: Date,
  ) {}
}

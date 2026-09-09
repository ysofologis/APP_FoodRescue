export class DisputeOpenedEvent {
  constructor(
    public readonly disputeId: string,
    public readonly listingId: string,
    public readonly openedBy: string,
    public readonly reason: string,
  ) {}
}

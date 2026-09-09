export class DisputeResolvedEvent {
  constructor(
    public readonly disputeId: string,
    public readonly listingId: string,
    public readonly resolution: string,
    public readonly resolvedBy: string,
  ) {}
}

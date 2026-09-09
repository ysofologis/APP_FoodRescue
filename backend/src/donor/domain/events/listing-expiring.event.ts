export class ListingExpiringEvent {
  constructor(
    public readonly listingId: string,
    public readonly title: string,
    public readonly expiresAt: Date,
  ) {}
}

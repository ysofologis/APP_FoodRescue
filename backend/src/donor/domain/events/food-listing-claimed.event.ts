export class FoodListingClaimedEvent {
  constructor(
    public readonly listingId: string,
    public readonly recipientId: string,
    public readonly claimedAt: Date,
  ) {}
}

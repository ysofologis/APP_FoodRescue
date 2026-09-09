export class RecipientVerifiedEvent {
  constructor(
    public readonly recipientId: string,
    public readonly name: string,
  ) {}
}

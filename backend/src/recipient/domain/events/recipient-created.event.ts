export class RecipientCreatedEvent {
  constructor(
    public readonly recipientId: string,
    public readonly name: string,
    public readonly orgType: string,
  ) {}
}

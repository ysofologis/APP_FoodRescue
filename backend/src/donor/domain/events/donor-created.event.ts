export class DonorCreatedEvent {
  constructor(
    public readonly donorId: string,
    public readonly name: string,
    public readonly contactEmail: string,
  ) {}
}

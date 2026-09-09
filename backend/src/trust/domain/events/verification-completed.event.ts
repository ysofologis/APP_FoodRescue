export class VerificationCompletedEvent {
  constructor(
    public readonly verifierId: string,
    public readonly organizationId: string,
    public readonly organizationType: string,
    public readonly verified: boolean,
  ) {}
}

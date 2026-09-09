export class ImpactRecordedEvent {
  constructor(
    public readonly metricId: string,
    public readonly donorId: string,
    public readonly recipientId: string,
    public readonly mealsSaved: number,
    public readonly co2KgAvoided: number,
    public readonly kgDelivered: number,
  ) {}
}

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventType: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventType = this.constructor.name;
  }
}
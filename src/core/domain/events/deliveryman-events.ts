import { DomainEvent } from './domain-event';

export class DeliveryManCreatedEvent extends DomainEvent {
  constructor(
    public readonly deliveryManId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string
  ) {
    super();
  }
}

export class DeliveryManActivatedEvent extends DomainEvent {
  constructor(
    public readonly deliveryManId: string,
    public readonly name: string
  ) {
    super();
  }
}

export class DeliveryManDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly deliveryManId: string,
    public readonly name: string
  ) {
    super();
  }
}

export class DeliveryManDeletedEvent extends DomainEvent {
  constructor(
    public readonly deliveryManId: string,
    public readonly name: string
  ) {
    super();
  }
}
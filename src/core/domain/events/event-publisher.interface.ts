import { DomainEvent } from './domain-event';

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishBatch(events: DomainEvent[]): Promise<void>;
}

export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';
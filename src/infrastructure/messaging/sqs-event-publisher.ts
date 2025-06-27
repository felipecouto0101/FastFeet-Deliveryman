import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { EventPublisher } from '../../core/domain/events/event-publisher.interface';
import { DomainEvent } from '../../core/domain/events/domain-event';

@Injectable()
export class SQSEventPublisher implements EventPublisher {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({});
    this.queueUrl = process.env.DELIVERYMAN_EVENTS_QUEUE_URL || 'https://sqs.us-east-1.amazonaws.com/123456789012/deliveryman-events';
  }

  async publish(event: DomainEvent): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify({
          eventType: event.eventType,
          occurredOn: event.occurredOn.toISOString(),
          data: event,
        }),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: event.eventType,
          },
          source: {
            DataType: 'String',
            StringValue: 'deliveryman-service',
          },
        },
      });

      await this.sqsClient.send(command);
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      const entries = events.map((event, index) => ({
        Id: `${event.eventType}-${index}`,
        MessageBody: JSON.stringify({
          eventType: event.eventType,
          occurredOn: event.occurredOn.toISOString(),
          data: event,
        }),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: event.eventType,
          },
          source: {
            DataType: 'String',
            StringValue: 'deliveryman-service',
          },
        },
      }));

      const command = new SendMessageBatchCommand({
        QueueUrl: this.queueUrl,
        Entries: entries,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      console.error('Failed to publish batch events:', error);
      throw error;
    }
  }
}
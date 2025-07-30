import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServiceResponse } from './request-response.interface';

@Injectable()
export class SQSResponsePublisher {
  private readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({});
  }

  async publishResponse(response: ServiceResponse, replyToQueue: string): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: replyToQueue,
        MessageBody: JSON.stringify(response),
        MessageAttributes: {
          messageType: {
            DataType: 'String',
            StringValue: 'RESPONSE',
          },
          requestId: {
            DataType: 'String',
            StringValue: response.requestId,
          },
          source: {
            DataType: 'String',
            StringValue: 'deliveryman-service',
          },
        },
      });

      await this.sqsClient.send(command);
    } catch (error) {
      console.error('Failed to publish response:', error);
      throw error;
    }
  }
}
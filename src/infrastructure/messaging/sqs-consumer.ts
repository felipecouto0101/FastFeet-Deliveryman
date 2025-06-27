import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { MessageHandler, SQSMessage } from './message-handler.interface';

@Injectable()
export class SQSConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly sqsClient: SQSClient;
  private readonly handlers: Map<string, MessageHandler> = new Map();
  private isRunning = false;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sqsClient = new SQSClient({});
  }

  onModuleInit() {
    this.startPolling();
  }

  onModuleDestroy() {
    this.stopPolling();
  }

  registerHandler(queueUrl: string, handler: MessageHandler): void {
    this.handlers.set(queueUrl, handler);
  }

  private startPolling(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.pollingInterval = setInterval(async () => {
      for (const [queueUrl, handler] of this.handlers.entries()) {
        await this.pollQueue(queueUrl, handler);
      }
    }, 5000);
  }

  private stopPolling(): void {
    this.isRunning = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async pollQueue(queueUrl: string, handler: MessageHandler): Promise<void> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        MessageAttributeNames: ['All'],
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages) {
        for (const message of response.Messages) {
          try {
            const sqsMessage: SQSMessage = {
              messageId: message.MessageId!,
              body: message.Body!,
              attributes: message.Attributes || {},
              messageAttributes: message.MessageAttributes || {},
            };

            await handler.handle(sqsMessage);

            await this.deleteMessage(queueUrl, message.ReceiptHandle!);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error polling queue:', error);
    }
  }

  private async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
}
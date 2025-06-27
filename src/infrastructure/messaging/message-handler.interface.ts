export interface MessageHandler {
  handle(message: any): Promise<void>;
}

export interface SQSMessage {
  messageId: string;
  body: string;
  attributes: Record<string, string>;
  messageAttributes: Record<string, any>;
}
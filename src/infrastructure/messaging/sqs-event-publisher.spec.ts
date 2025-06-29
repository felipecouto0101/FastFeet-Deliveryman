import { SQSEventPublisher } from './sqs-event-publisher';
import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { DeliveryManCreatedEvent } from '../../core/domain/events/deliveryman-events';

jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn(),
  SendMessageCommand: jest.fn(),
  SendMessageBatchCommand: jest.fn(),
}));

describe('SQSEventPublisher', () => {
  let publisher: SQSEventPublisher;
  let mockSQSClient: any;

  beforeEach(() => {
    mockSQSClient = {
      send: jest.fn(),
    };

    (SQSClient as jest.Mock).mockImplementation(() => mockSQSClient);
    
    publisher = new SQSEventPublisher();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('should publish single event successfully', async () => {
      const event = new DeliveryManCreatedEvent('123', 'John', 'john@test.com', '123.456.789-00', '(11) 99999-9999');
      mockSQSClient.send.mockResolvedValue({} as any);

      await publisher.publish(event);

      expect(mockSQSClient.send).toHaveBeenCalledTimes(1);
      expect(mockSQSClient.send).toHaveBeenCalledWith(expect.any(SendMessageCommand));
    });

    it('should handle publish error and log it', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const event = new DeliveryManCreatedEvent('123', 'John', 'john@test.com', '123.456.789-00', '(11) 99999-9999');
      const error = new Error('SQS Error');
      mockSQSClient.send.mockRejectedValue(error);

      await expect(publisher.publish(event)).rejects.toThrow(error);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to publish event:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('publishBatch', () => {
    it('should publish batch of events successfully', async () => {
      const events = [
        new DeliveryManCreatedEvent('123', 'John', 'john@test.com', '123.456.789-00', '(11) 99999-9999'),
        new DeliveryManCreatedEvent('456', 'Jane', 'jane@test.com', '987.654.321-00', '(11) 88888-8888'),
      ];
      mockSQSClient.send.mockResolvedValue({} as any);

      await publisher.publishBatch(events);

      expect(mockSQSClient.send).toHaveBeenCalledTimes(1);
      expect(mockSQSClient.send).toHaveBeenCalledWith(expect.any(SendMessageBatchCommand));
    });

    it('should handle empty events array', async () => {
      await publisher.publishBatch([]);

      expect(mockSQSClient.send).not.toHaveBeenCalled();
    });

    it('should handle batch publish error and log it', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const events = [
        new DeliveryManCreatedEvent('123', 'John', 'john@test.com', '123.456.789-00', '(11) 99999-9999'),
      ];
      const error = new Error('SQS Batch Error');
      mockSQSClient.send.mockRejectedValue(error);

      await expect(publisher.publishBatch(events)).rejects.toThrow(error);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to publish batch events:', error);

      consoleSpy.mockRestore();
    });
  });
});
import { SQSConsumer } from './sqs-consumer';
import { SQSClient, ReceiveMessageCommand } from '@aws-sdk/client-sqs';

jest.mock('@aws-sdk/client-sqs');

describe('SQSConsumer', () => {
  let consumer: SQSConsumer;
  let mockSQSClient: jest.Mocked<SQSClient>;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    
    mockSQSClient = {
      send: jest.fn(),
    } as any;

    (SQSClient as jest.Mock).mockImplementation(() => mockSQSClient);
    
    consumer = new SQSConsumer();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startConsuming', () => {
    it('should start consuming messages from queue', async () => {
      const mockHandler = { handle: jest.fn().mockResolvedValue(undefined) };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify({ eventType: 'DeliveryManCreated', data: {} }),
              ReceiptHandle: 'receipt-123'
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      
      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockSQSClient.send).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand));
      expect(mockHandler.handle).toHaveBeenCalled();
      
      consumer.stopConsuming();
      await promise;
    });

    it('should handle empty message response', async () => {
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock).mockResolvedValue({ Messages: [] });

      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockSQSClient.send).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand));
      expect(mockHandler.handle).not.toHaveBeenCalled();
      
      consumer.stopConsuming();
      await promise;
    });

    it('should handle message processing error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockHandler = { handle: jest.fn().mockRejectedValue(new Error('Processing error')) };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify({ eventType: 'DeliveryManCreated', data: {} }),
              ReceiptHandle: 'receipt-123'
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(consoleSpy).toHaveBeenCalledWith('Error processing message:', expect.any(Error));
      
      consumer.stopConsuming();
      await promise;
      consoleSpy.mockRestore();
    });
  });

  describe('stopConsuming', () => {
    it('should stop consuming messages', () => {
      consumer.stopConsuming();
      expect(consumer['isConsuming']).toBe(false);
    });
  });

  describe('onModuleInit', () => {
    it('should not start polling in test environment', () => {
      const startPollingSpy = jest.spyOn(consumer as any, 'startPolling');
      consumer.onModuleInit();
      expect(startPollingSpy).not.toHaveBeenCalled();
    });

    it('should start polling in non-test environment', () => {
      process.env.NODE_ENV = 'production';
      const startPollingSpy = jest.spyOn(consumer as any, 'startPolling');
      consumer.onModuleInit();
      expect(startPollingSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should stop polling on module destroy', () => {
      const stopPollingSpy = jest.spyOn(consumer as any, 'stopPolling');
      consumer.onModuleDestroy();
      expect(stopPollingSpy).toHaveBeenCalled();
    });
  });

  describe('registerHandler', () => {
    it('should register handler for queue', () => {
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      consumer.registerHandler(queueUrl, mockHandler);
      
      expect(consumer['handlers'].get(queueUrl)).toBe(mockHandler);
    });
  });

  describe('startPolling', () => {
    it('should not start polling if already running', () => {
      consumer['isRunning'] = true;
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      consumer['startPolling']();
      
      expect(setIntervalSpy).not.toHaveBeenCalled();
      setIntervalSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should handle polling queue error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock).mockRejectedValue(new Error('SQS error'));

      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(consoleSpy).toHaveBeenCalledWith('Error polling queue:', expect.any(Error));
      
      consumer.stopConsuming();
      await promise;
      consoleSpy.mockRestore();
    });

    it('should handle delete message error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockHandler = { handle: jest.fn().mockResolvedValue(undefined) };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify({ eventType: 'DeliveryManCreated', data: {} }),
              ReceiptHandle: 'receipt-123'
            }
          ]
        })
        .mockRejectedValueOnce(new Error('Delete error')); 

      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting message:', expect.any(Error));
      
      consumer.stopConsuming();
      await promise;
      consoleSpy.mockRestore();
    });

    it('should handle messages without response', async () => {
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock).mockResolvedValue({}); 

      const promise = consumer.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockHandler.handle).not.toHaveBeenCalled();
      
      consumer.stopConsuming();
      await promise;
    });
  });

  describe('non-test environment', () => {
    it('should use polling interval in non-test environment', async () => {
      process.env.NODE_ENV = 'production';
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      const startPollingSpy = jest.spyOn(consumer as any, 'startPolling');
      
      consumer.startConsuming(queueUrl, mockHandler);
      
      expect(startPollingSpy).toHaveBeenCalled();
      
      consumer.stopConsuming();
    });
  });

  describe('service request processing', () => {
    it('should process service request when messageType is REQUEST', async () => {
      const mockRequestHandler = {
        handle: jest.fn().mockResolvedValue({ status: 'SUCCESS' })
      };
      const mockResponsePublisher = {
        publishResponse: jest.fn().mockResolvedValue(undefined)
      };
      
      const consumerWithHandlers = new (SQSConsumer as any)(mockRequestHandler, mockResponsePublisher);
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      const serviceRequest = {
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'response-queue'
      };
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify(serviceRequest),
              ReceiptHandle: 'receipt-123',
              MessageAttributes: {
                messageType: { StringValue: 'REQUEST' }
              }
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      const promise = consumerWithHandlers.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockRequestHandler.handle).toHaveBeenCalled();
      expect(mockResponsePublisher.publishResponse).toHaveBeenCalled();
      
      consumerWithHandlers.stopConsuming();
      await promise;
    });

    it('should handle service request without replyTo', async () => {
      const mockRequestHandler = {
        handle: jest.fn().mockResolvedValue({ status: 'SUCCESS' })
      };
      const mockResponsePublisher = {
        publishResponse: jest.fn().mockResolvedValue(undefined)
      };
      
      const consumerWithHandlers = new (SQSConsumer as any)(mockRequestHandler, mockResponsePublisher);
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      const serviceRequest = {
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' }
        
      };
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify(serviceRequest),
              ReceiptHandle: 'receipt-123',
              MessageAttributes: {
                messageType: { StringValue: 'REQUEST' }
              }
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      const promise = consumerWithHandlers.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(mockRequestHandler.handle).toHaveBeenCalled();
      expect(mockResponsePublisher.publishResponse).not.toHaveBeenCalled();
      
      consumerWithHandlers.stopConsuming();
      await promise;
    });

    it('should handle service request processing error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockRequestHandler = {
        handle: jest.fn().mockRejectedValue(new Error('Request processing error'))
      };
      const mockResponsePublisher = {
        publishResponse: jest.fn().mockResolvedValue(undefined)
      };
      
      const consumerWithHandlers = new (SQSConsumer as any)(mockRequestHandler, mockResponsePublisher);
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      const serviceRequest = {
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'response-queue'
      };
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: JSON.stringify(serviceRequest),
              ReceiptHandle: 'receipt-123',
              MessageAttributes: {
                messageType: { StringValue: 'REQUEST' }
              }
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      const promise = consumerWithHandlers.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(consoleSpy).toHaveBeenCalledWith('Error processing service request:', expect.any(Error));
      
      consumerWithHandlers.stopConsuming();
      await promise;
      consoleSpy.mockRestore();
    });

    it('should handle JSON parse error in service request', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockRequestHandler = {
        handle: jest.fn().mockResolvedValue({ status: 'SUCCESS' })
      };
      const mockResponsePublisher = {
        publishResponse: jest.fn().mockResolvedValue(undefined)
      };
      
      const consumerWithHandlers = new (SQSConsumer as any)(mockRequestHandler, mockResponsePublisher);
      const mockHandler = { handle: jest.fn() };
      const queueUrl = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
      
      (mockSQSClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Messages: [
            {
              MessageId: '123',
              Body: 'invalid json',
              ReceiptHandle: 'receipt-123',
              MessageAttributes: {
                messageType: { StringValue: 'REQUEST' }
              }
            }
          ]
        })
        .mockResolvedValueOnce({}); 

      const promise = consumerWithHandlers.startConsuming(queueUrl, mockHandler);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(consoleSpy).toHaveBeenCalledWith('Error processing service request:', expect.any(Error));
      
      consumerWithHandlers.stopConsuming();
      await promise;
      consoleSpy.mockRestore();
    });
  });
});
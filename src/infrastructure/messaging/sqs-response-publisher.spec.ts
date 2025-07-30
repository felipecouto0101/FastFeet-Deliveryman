import { SQSResponsePublisher } from './sqs-response-publisher';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServiceResponse } from './request-response.interface';

jest.mock('@aws-sdk/client-sqs');

describe('SQSResponsePublisher', () => {
  let publisher: SQSResponsePublisher;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    
    (SQSClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    
    publisher = new SQSResponsePublisher();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publishResponse', () => {
    it('should publish response successfully', async () => {
      const response: ServiceResponse = {
        requestId: 'req-123',
        type: 'DELIVERYMAN_VALIDATION_RESPONSE',
        status: 'SUCCESS',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'john@example.com',
          name: 'John Doe',
          cpf: '123.456.789-00',
          passwordHash: 'hashedPassword',
          isActive: true,
        },
        timestamp: '2024-01-01T10:00:00Z',
      };

      const replyToQueue = 'https://sqs.us-east-1.amazonaws.com/123456789/auth-service-responses';

      mockSend.mockResolvedValue({});

      await publisher.publishResponse(response, replyToQueue);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(SendMessageCommand));
    });

    it('should handle SQS send error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const response: ServiceResponse = {
        requestId: 'req-error',
        type: 'DELIVERYMAN_VALIDATION_RESPONSE',
        status: 'SUCCESS',
        data: { id: '123' },
        timestamp: '2024-01-01T10:00:00Z',
      };

      const replyToQueue = 'https://sqs.us-east-1.amazonaws.com/123456789/auth-service-responses';
      const sqsError = new Error('SQS send failed');

      mockSend.mockRejectedValue(sqsError);

      await expect(publisher.publishResponse(response, replyToQueue)).rejects.toThrow('SQS send failed');

      expect(consoleSpy).toHaveBeenCalledWith('Failed to publish response:', sqsError);
      
      consoleSpy.mockRestore();
    });

    it('should call send method with SendMessageCommand', async () => {
      const response: ServiceResponse = {
        requestId: 'req-456',
        type: 'ERROR_RESPONSE',
        status: 'ERROR',
        error: {
          code: 'DELIVERYMAN_NOT_FOUND',
          message: 'Delivery man not found',
        },
        timestamp: '2024-01-01T10:00:00Z',
      };

      const replyToQueue = 'https://sqs.us-east-1.amazonaws.com/123456789/responses';

      mockSend.mockResolvedValue({});

      await publisher.publishResponse(response, replyToQueue);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.any(SendMessageCommand));
    });
  });
});
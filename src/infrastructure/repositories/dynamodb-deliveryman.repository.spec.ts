import { DynamoDBDeliveryManRepository } from './dynamodb-deliveryman.repository';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DeliveryMan } from '../../core/domain/entities/deliveryman.entity';
import { DatabaseQueryError } from '../errors/database-errors';

jest.mock('@aws-sdk/lib-dynamodb');

describe('DynamoDBDeliveryManRepository', () => {
  let repository: DynamoDBDeliveryManRepository;
  let mockDdbDocClient: jest.Mocked<DynamoDBDocumentClient>;

  const mockDeliveryMan = new DeliveryMan(
    '123',
    'John Doe',
    'john@example.com',
    '123.456.789-00',
    '(11) 99999-9999',
    'hashedPassword'
  );

  beforeEach(() => {
    mockDdbDocClient = {
      send: jest.fn(),
    } as any;

    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue(mockDdbDocClient);
    
    repository = new DynamoDBDeliveryManRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create delivery man successfully', async () => {
      (mockDdbDocClient.send as jest.Mock).mockResolvedValue({});

      await repository.create(mockDeliveryMan);

      expect(mockDdbDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw DatabaseQueryError on create failure', async () => {
      const error = new Error('DynamoDB Error');
      (mockDdbDocClient.send as jest.Mock).mockRejectedValue(error);

      await expect(repository.create(mockDeliveryMan)).rejects.toThrow(DatabaseQueryError);
    });
  });

  describe('findById', () => {
    it('should return delivery man when found', async () => {
      const mockItem = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockDdbDocClient.send as jest.Mock).mockResolvedValue({ Item: mockItem });

      const result = await repository.findById('123');

      expect(result).toBeInstanceOf(DeliveryMan);
      expect(result?.id).toBe('123');
      expect(mockDdbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should return null when delivery man not found', async () => {
      (mockDdbDocClient.send as jest.Mock).mockResolvedValue({});

      const result = await repository.findById('123');

      expect(result).toBeNull();
    });

    it('should throw DatabaseQueryError on findById failure', async () => {
      const error = new Error('DynamoDB Error');
      (mockDdbDocClient.send as jest.Mock).mockRejectedValue(error);

      await expect(repository.findById('123')).rejects.toThrow(DatabaseQueryError);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockItems = [
        {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          cpf: '123.456.789-00',
          phone: '(11) 99999-9999',
          password: 'hashedPassword',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (mockDdbDocClient.send as jest.Mock).mockResolvedValue({
        Items: mockItems,
        LastEvaluatedKey: { id: '123' },
      });

      const result = await repository.findAll({ limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toBeInstanceOf(DeliveryMan);
      expect(result.hasNext).toBe(true);
      expect(result.lastEvaluatedKey).toBeDefined();
      expect(mockDdbDocClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    it('should handle empty results', async () => {
      (mockDdbDocClient.send as jest.Mock).mockResolvedValue({ Items: [] });

      const result = await repository.findAll({ limit: 10 });

      expect(result.items).toHaveLength(0);
      expect(result.hasNext).toBe(false);
      expect(result.lastEvaluatedKey).toBeUndefined();
    });

    it('should throw DatabaseQueryError on findAll failure', async () => {
      const error = new Error('DynamoDB Error');
      (mockDdbDocClient.send as jest.Mock).mockRejectedValue(error);

      await expect(repository.findAll({ limit: 10 })).rejects.toThrow(DatabaseQueryError);
    });
  });

  describe('update', () => {
    it('should update delivery man successfully', async () => {
      const mockItem = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      (mockDdbDocClient.send as jest.Mock)
        .mockResolvedValueOnce({ Item: mockItem }) 
        .mockResolvedValueOnce({}); 

      await repository.update(mockDeliveryMan);

      expect(mockDdbDocClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw DatabaseQueryError on update failure', async () => {
      const error = new Error('DynamoDB Error');
      (mockDdbDocClient.send as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(mockDeliveryMan)).rejects.toThrow(DatabaseQueryError);
    });
  });

  describe('delete', () => {
    it('should delete delivery man successfully', async () => {
      const mockItem = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      (mockDdbDocClient.send as jest.Mock)
        .mockResolvedValueOnce({ Item: mockItem }) 
        .mockResolvedValueOnce({}); 

      await repository.delete('123');

      expect(mockDdbDocClient.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    it('should throw DatabaseQueryError on delete failure', async () => {
      const error = new Error('DynamoDB Error');
      (mockDdbDocClient.send as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete('123')).rejects.toThrow(DatabaseQueryError);
    });
  });
});
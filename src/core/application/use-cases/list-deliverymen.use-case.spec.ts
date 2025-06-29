import { ListDeliveryMenUseCase } from './list-deliverymen.use-case';
import { PaginationParams } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository, PaginatedResult } from '../../domain/repositories/deliveryman-repository.interface';

describe('ListDeliveryMenUseCase', () => {
  let useCase: ListDeliveryMenUseCase;
  let mockRepository: jest.Mocked<DeliveryManRepository>;

  const mockDeliveryMen = [
    new DeliveryMan(
      '1',
      'John Doe',
      'john@example.com',
      '123.456.789-00',
      '(11) 99999-9999',
      'hashedPassword1'
    ),
    new DeliveryMan(
      '2',
      'Jane Smith',
      'jane@example.com',
      '987.654.321-00',
      '(11) 88888-8888',
      'hashedPassword2'
    ),
  ];

  const mockPaginatedResult: PaginatedResult<DeliveryMan> = {
    items: mockDeliveryMen,
    lastEvaluatedKey: 'eyJpZCI6IjIifQ==',
    hasNext: true,
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListDeliveryMenUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return paginated delivery men with default parameters', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.execute();

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return paginated delivery men with custom limit', async () => {
      const customLimit = 5;
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const input: PaginationParams = { limit: customLimit };
      const result = await useCase.execute(input);

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(input);
    });

    it('should return paginated delivery men with lastEvaluatedKey', async () => {
      const lastEvaluatedKey = 'eyJpZCI6IjEifQ==';
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const input: PaginationParams = { limit: 10, lastEvaluatedKey };
      const result = await useCase.execute(input);

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(input);
    });

    it('should return paginated delivery men with both limit and lastEvaluatedKey', async () => {
      const customLimit = 20;
      const lastEvaluatedKey = 'eyJpZCI6IjEifQ==';
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const input: PaginationParams = { 
        limit: customLimit, 
        lastEvaluatedKey 
      };
      const result = await useCase.execute(input);

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(input);
    });

    it('should return empty result when no delivery men exist', async () => {
      const emptyResult: PaginatedResult<DeliveryMan> = {
        items: [],
        lastEvaluatedKey: undefined,
        hasNext: false,
      };
      mockRepository.findAll.mockResolvedValue(emptyResult);

      const result = await useCase.execute();

      expect(result).toBe(emptyResult);
      expect(result.items).toHaveLength(0);
      expect(result.hasNext).toBe(false);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Repository error');
      mockRepository.findAll.mockRejectedValue(repositoryError);

      await expect(useCase.execute()).rejects.toThrow(repositoryError);
    });

    it('should pass undefined input correctly', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.execute(undefined);

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should handle partial input correctly', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const input: PaginationParams = { limit: 15 };
      const result = await useCase.execute(input);

      expect(result).toBe(mockPaginatedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(input);
    });
  });
});
import { FindDeliveryManUseCase } from './find-deliveryman.use-case';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

describe('FindDeliveryManUseCase', () => {
  let useCase: FindDeliveryManUseCase;
  let mockRepository: jest.Mocked<DeliveryManRepository>;

  const mockId = '123e4567-e89b-12d3-a456-426614174000';
  const mockDeliveryMan = new DeliveryMan(
    mockId,
    'John Doe',
    'john@example.com',
    '123.456.789-00',
    '(11) 99999-9999',
    'hashedPassword'
  );

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindDeliveryManUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return delivery man when found', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);

      const result = await useCase.execute(mockId);

      expect(result).toBe(mockDeliveryMan);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
    });

    it('should throw DeliveryManNotFoundError when delivery man not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(mockId)).rejects.toThrow(DeliveryManNotFoundError);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
    });

    it('should throw error when repository fails', async () => {
      const repositoryError = new Error('Repository error');
      mockRepository.findById.mockRejectedValue(repositoryError);

      await expect(useCase.execute(mockId)).rejects.toThrow(repositoryError);
    });

    it('should pass correct id to repository', async () => {
      const customId = 'custom-id-123';
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);

      await useCase.execute(customId);

      expect(mockRepository.findById).toHaveBeenCalledWith(customId);
    });
  });
});
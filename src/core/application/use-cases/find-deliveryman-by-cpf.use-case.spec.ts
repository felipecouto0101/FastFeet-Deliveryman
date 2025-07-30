import { FindDeliveryManByCpfUseCase } from './find-deliveryman-by-cpf.use-case';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

describe('FindDeliveryManByCpfUseCase', () => {
  let useCase: FindDeliveryManByCpfUseCase;
  let mockRepository: jest.Mocked<DeliveryManRepository>;

  const mockCpf = '123.456.789-00';
  const mockDeliveryMan = new DeliveryMan(
    '123e4567-e89b-12d3-a456-426614174000',
    'John Doe',
    'john@example.com',
    mockCpf,
    '(11) 99999-9999',
    'hashedPassword'
  );

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindDeliveryManByCpfUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return delivery man when found by CPF', async () => {
      mockRepository.findByCpf.mockResolvedValue(mockDeliveryMan);

      const result = await useCase.execute(mockCpf);

      expect(result).toBe(mockDeliveryMan);
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(mockCpf);
      expect(mockRepository.findByCpf).toHaveBeenCalledTimes(1);
    });

    it('should throw DeliveryManNotFoundError when delivery man not found', async () => {
      mockRepository.findByCpf.mockResolvedValue(null);

      await expect(useCase.execute(mockCpf)).rejects.toThrow(DeliveryManNotFoundError);
      await expect(useCase.execute(mockCpf)).rejects.toThrow(`Delivery man with CPF ${mockCpf} not found`);
      
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(mockCpf);
      expect(mockRepository.findByCpf).toHaveBeenCalledTimes(2);
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRepository.findByCpf.mockRejectedValue(repositoryError);

      await expect(useCase.execute(mockCpf)).rejects.toThrow(repositoryError);
      
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(mockCpf);
    });

    it('should handle different CPF formats', async () => {
      const cpfWithoutMask = '12345678900';
      mockRepository.findByCpf.mockResolvedValue(mockDeliveryMan);

      const result = await useCase.execute(cpfWithoutMask);

      expect(result).toBe(mockDeliveryMan);
      expect(mockRepository.findByCpf).toHaveBeenCalledWith(cpfWithoutMask);
    });
  });
});
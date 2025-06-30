import { CreateDeliveryManUseCase, CreateDeliveryManInput } from './create-deliveryman.use-case';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { EventPublisher } from '../../domain/events/event-publisher.interface';
import { DeliveryManCreatedEvent } from '../../domain/events/deliveryman-events';

describe('CreateDeliveryManUseCase', () => {
  let useCase: CreateDeliveryManUseCase;
  let mockRepository: jest.Mocked<DeliveryManRepository>;
  let mockEventPublisher: jest.Mocked<EventPublisher>;

  const mockInput: CreateDeliveryManInput = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
    password: 'password123',
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEventPublisher = {
      publish: jest.fn(),
      publishBatch: jest.fn(),
    };

    useCase = new CreateDeliveryManUseCase(mockRepository, mockEventPublisher);
  });

  describe('execute', () => {
    it('should create a delivery man successfully', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const result = await useCase.execute(mockInput);

      expect(result).toBeInstanceOf(DeliveryMan);
      expect(result.id).toBe(mockInput.id);
      expect(result.name).toBe(mockInput.name);
      expect(result.email).toBe(mockInput.email);
      expect(result.cpf).toBe(mockInput.cpf);
      expect(result.phone).toBe(mockInput.phone);
      expect(result.isActive).toBe(true);
    });

    it('should hash the password', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const result = await useCase.execute(mockInput);

      expect(result.password).not.toBe(mockInput.password);
      expect(result.password).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should call repository create method', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockInput);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(DeliveryMan));
    });

    it('should publish domain events', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockInput);

      expect(mockEventPublisher.publishBatch).toHaveBeenCalledTimes(1);
      expect(mockEventPublisher.publishBatch).toHaveBeenCalledWith([
        expect.any(DeliveryManCreatedEvent),
      ]);
    });

    it('should clear events after publishing', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const result = await useCase.execute(mockInput);

      expect(result.domainEvents).toHaveLength(0);
    });

    it('should throw error when repository fails', async () => {
      const repositoryError = new Error('Repository error');
      mockRepository.create.mockRejectedValue(repositoryError);

      await expect(useCase.execute(mockInput)).rejects.toThrow(repositoryError);
    });

    it('should throw error when event publisher fails', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      const publisherError = new Error('Publisher error');
      mockEventPublisher.publishBatch.mockRejectedValue(publisherError);

      await expect(useCase.execute(mockInput)).rejects.toThrow(publisherError);
    });

    it('should not publish events if none exist', async () => {
      mockRepository.create.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const deliveryManSpy = jest.spyOn(DeliveryMan.prototype, 'markAsCreated').mockImplementation();

      await useCase.execute(mockInput);

      expect(mockEventPublisher.publishBatch).not.toHaveBeenCalled();

      deliveryManSpy.mockRestore();
    });
  });
});
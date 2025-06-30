import { DeleteDeliveryManUseCase } from './delete-deliveryman.use-case';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { EventPublisher } from '../../domain/events/event-publisher.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';
import { DeliveryManDeletedEvent } from '../../domain/events/deliveryman-events';

describe('DeleteDeliveryManUseCase', () => {
  let useCase: DeleteDeliveryManUseCase;
  let mockRepository: jest.Mocked<DeliveryManRepository>;
  let mockEventPublisher: jest.Mocked<EventPublisher>;
  let mockDeliveryMan: DeliveryMan;

  const mockId = '123e4567-e89b-12d3-a456-426614174000';

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

    mockDeliveryMan = new DeliveryMan(
      mockId,
      'John Doe',
      'john@example.com',
      '123.456.789-00',
      '(11) 99999-9999',
      'hashedPassword'
    );

    useCase = new DeleteDeliveryManUseCase(mockRepository, mockEventPublisher);
  });

  describe('execute', () => {
    it('should throw DeliveryManNotFoundError when delivery man not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(mockId)).rejects.toThrow(DeliveryManNotFoundError);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
      expect(mockRepository.delete).not.toHaveBeenCalled();
      expect(mockEventPublisher.publishBatch).not.toHaveBeenCalled();
    });

    it('should delete delivery man successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.delete.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      expect(mockRepository.findById).toHaveBeenCalledWith(mockId);
      expect(mockRepository.delete).toHaveBeenCalledWith(mockId);
    });

    it('should publish deleted event before deletion', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.delete.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      expect(mockEventPublisher.publishBatch).toHaveBeenCalledWith([
        expect.any(DeliveryManDeletedEvent),
      ]);
      const publishCall = (mockEventPublisher.publishBatch as jest.Mock).mock.invocationCallOrder[0];
      const deleteCall = (mockRepository.delete as jest.Mock).mock.invocationCallOrder[0];
      expect(publishCall).toBeLessThan(deleteCall);
    });

    it('should clear events after publishing', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.delete.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      expect(mockDeliveryMan.domainEvents).toHaveLength(0);
    });

    it('should throw error when repository findById fails', async () => {
      const repositoryError = new Error('Repository findById error');
      mockRepository.findById.mockRejectedValue(repositoryError);

      await expect(useCase.execute(mockId)).rejects.toThrow(repositoryError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when event publisher fails', async () => {
      const publisherError = new Error('Publisher error');
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockEventPublisher.publishBatch.mockRejectedValue(publisherError);

      await expect(useCase.execute(mockId)).rejects.toThrow(publisherError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when repository delete fails', async () => {
      const repositoryError = new Error('Repository delete error');
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);
      mockRepository.delete.mockRejectedValue(repositoryError);

      await expect(useCase.execute(mockId)).rejects.toThrow(repositoryError);
    });

    it('should call methods in correct order', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.delete.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      const findByIdCall = (mockRepository.findById as jest.Mock).mock.invocationCallOrder[0];
      const publishCall = (mockEventPublisher.publishBatch as jest.Mock).mock.invocationCallOrder[0];
      const deleteCall = (mockRepository.delete as jest.Mock).mock.invocationCallOrder[0];

      expect(findByIdCall).toBeLessThan(publishCall);
      expect(publishCall).toBeLessThan(deleteCall);
    });
  });
});
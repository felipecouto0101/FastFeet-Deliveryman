import { UpdateDeliveryManUseCase, UpdateDeliveryManInput } from './update-deliveryman.use-case';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { EventPublisher } from '../../domain/events/event-publisher.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';
import { DeliveryManActivatedEvent, DeliveryManDeactivatedEvent } from '../../domain/events/deliveryman-events';

describe('UpdateDeliveryManUseCase', () => {
  let useCase: UpdateDeliveryManUseCase;
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

    useCase = new UpdateDeliveryManUseCase(mockRepository, mockEventPublisher);
  });

  describe('execute', () => {
    it('should throw DeliveryManNotFoundError when delivery man not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const input: UpdateDeliveryManInput = { id: mockId, name: 'New Name' };

      await expect(useCase.execute(input)).rejects.toThrow(DeliveryManNotFoundError);
    });

    it('should update name when provided', async () => {
      const newName = 'Jane Doe';
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, name: newName };
      const result = await useCase.execute(input);

      expect(result.name).toBe(newName);
      expect(mockRepository.update).toHaveBeenCalledWith(mockDeliveryMan);
    });

    it('should update email when provided', async () => {
      const newEmail = 'jane@example.com';
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, email: newEmail };
      const result = await useCase.execute(input);

      expect(result.email).toBe(newEmail);
    });

    it('should update phone when provided', async () => {
      const newPhone = '(11) 88888-8888';
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, phone: newPhone };
      const result = await useCase.execute(input);

      expect(result.phone).toBe(newPhone);
    });

    it('should update password when provided', async () => {
      const newPassword = 'newPassword123';
      const oldPassword = mockDeliveryMan.password;
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, password: newPassword };
      const result = await useCase.execute(input);

      expect(result.password).not.toBe(oldPassword);
      expect(result.password).not.toBe(newPassword);
    });

    it('should activate delivery man when isActive is true', async () => {
      const inactiveDeliveryMan = new DeliveryMan(
        mockId,
        'John Doe',
        'john@example.com',
        '123.456.789-00',
        '(11) 99999-9999',
        'hashedPassword',
        false
      );
      mockRepository.findById.mockResolvedValue(inactiveDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, isActive: true };
      const result = await useCase.execute(input);

      expect(result.isActive).toBe(true);
      expect(mockEventPublisher.publishBatch).toHaveBeenCalledWith([
        expect.any(DeliveryManActivatedEvent),
      ]);
    });

    it('should deactivate delivery man when isActive is false', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, isActive: false };
      const result = await useCase.execute(input);

      expect(result.isActive).toBe(false);
      expect(mockEventPublisher.publishBatch).toHaveBeenCalledWith([
        expect.any(DeliveryManDeactivatedEvent),
      ]);
    });

    it('should update multiple fields at once', async () => {
      const newName = 'Jane Doe';
      const newEmail = 'jane@example.com';
      const newPhone = '(11) 88888-8888';
      
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = {
        id: mockId,
        name: newName,
        email: newEmail,
        phone: newPhone,
      };
      const result = await useCase.execute(input);

      expect(result.name).toBe(newName);
      expect(result.email).toBe(newEmail);
      expect(result.phone).toBe(newPhone);
    });

    it('should not publish events if no status change occurs', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, name: 'New Name' };
      await useCase.execute(input);

      expect(mockEventPublisher.publishBatch).not.toHaveBeenCalled();
    });

    it('should clear events after publishing', async () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockResolvedValue(undefined);

      const input: UpdateDeliveryManInput = { id: mockId, isActive: false };
      const result = await useCase.execute(input);

      expect(result.domainEvents).toHaveLength(0);
    });

    it('should throw error when repository update fails', async () => {
      const repositoryError = new Error('Repository error');
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockRejectedValue(repositoryError);

      const input: UpdateDeliveryManInput = { id: mockId, name: 'New Name' };

      await expect(useCase.execute(input)).rejects.toThrow(repositoryError);
    });

    it('should throw error when event publisher fails', async () => {
      const publisherError = new Error('Publisher error');
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);
      mockEventPublisher.publishBatch.mockRejectedValue(publisherError);

      const input: UpdateDeliveryManInput = { id: mockId, isActive: false };

      await expect(useCase.execute(input)).rejects.toThrow(publisherError);
    });
  });
});
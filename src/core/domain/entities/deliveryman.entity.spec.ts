import { DeliveryMan } from './deliveryman.entity';
import { DeliveryManCreatedEvent, DeliveryManActivatedEvent, DeliveryManDeactivatedEvent, DeliveryManDeletedEvent } from '../events/deliveryman-events';

describe('DeliveryMan Entity', () => {
  let deliveryMan: DeliveryMan;
  const mockId = '123e4567-e89b-12d3-a456-426614174000';
  const mockName = 'John Doe';
  const mockEmail = 'john@example.com';
  const mockCpf = '123.456.789-00';
  const mockPhone = '(11) 99999-9999';
  const mockPassword = 'password123';

  beforeEach(() => {
    deliveryMan = new DeliveryMan(
      mockId,
      mockName,
      mockEmail,
      mockCpf,
      mockPhone,
      mockPassword
    );
  });

  describe('Constructor', () => {
    it('should create a delivery man with correct properties', () => {
      expect(deliveryMan.id).toBe(mockId);
      expect(deliveryMan.name).toBe(mockName);
      expect(deliveryMan.email).toBe(mockEmail);
      expect(deliveryMan.cpf).toBe(mockCpf);
      expect(deliveryMan.phone).toBe(mockPhone);
      expect(deliveryMan.isActive).toBe(true);
      expect(deliveryMan.createdAt).toBeInstanceOf(Date);
      expect(deliveryMan.updatedAt).toBeInstanceOf(Date);
      expect(deliveryMan.domainEvents).toEqual([]);
    });

    it('should create with custom isActive, createdAt and updatedAt', () => {
      const customDate = new Date('2023-01-01');
      const customDeliveryMan = new DeliveryMan(
        mockId,
        mockName,
        mockEmail,
        mockCpf,
        mockPhone,
        mockPassword,
        false,
        customDate,
        customDate
      );

      expect(customDeliveryMan.isActive).toBe(false);
      expect(customDeliveryMan.createdAt).toBe(customDate);
      expect(customDeliveryMan.updatedAt).toBe(customDate);
    });
  });

  describe('Setters', () => {
    it('should update name and updatedAt', async () => {
      const oldUpdatedAt = deliveryMan.updatedAt;
      const newName = 'Jane Doe';
      
      await new Promise(resolve => setTimeout(resolve, 10));
      deliveryMan.name = newName;
      
      expect(deliveryMan.name).toBe(newName);
      expect(deliveryMan.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should update email and updatedAt', async () => {
      const oldUpdatedAt = deliveryMan.updatedAt;
      const newEmail = 'jane@example.com';
      
      await new Promise(resolve => setTimeout(resolve, 10));
      deliveryMan.email = newEmail;
      
      expect(deliveryMan.email).toBe(newEmail);
      expect(deliveryMan.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should update cpf and updatedAt', async () => {
      const oldUpdatedAt = deliveryMan.updatedAt;
      const newCpf = '987.654.321-00';
      
      await new Promise(resolve => setTimeout(resolve, 10));
      deliveryMan.cpf = newCpf;
      
      expect(deliveryMan.cpf).toBe(newCpf);
      expect(deliveryMan.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should update phone and updatedAt', async () => {
      const oldUpdatedAt = deliveryMan.updatedAt;
      const newPhone = '(11) 88888-8888';
      
      await new Promise(resolve => setTimeout(resolve, 10));
      deliveryMan.phone = newPhone;
      
      expect(deliveryMan.phone).toBe(newPhone);
      expect(deliveryMan.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });
  });

  describe('Password Management', () => {
    it('should set password with hash', async () => {
      const newPassword = 'newPassword123';
      const oldPassword = deliveryMan.password;
      
      await deliveryMan.setPassword(newPassword);
      
      expect(deliveryMan.password).not.toBe(newPassword);
      expect(deliveryMan.password).not.toBe(oldPassword);
      expect(deliveryMan.password).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should validate correct password', async () => {
      await deliveryMan.setPassword('testPassword');
      
      const isValid = await deliveryMan.validatePassword('testPassword');
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      await deliveryMan.setPassword('testPassword');
      
      const isValid = await deliveryMan.validatePassword('wrongPassword');
      
      expect(isValid).toBe(false);
    });
  });

  describe('Status Management', () => {
    it('should activate inactive delivery man and add domain event', () => {
      const inactiveDeliveryMan = new DeliveryMan(
        mockId,
        mockName,
        mockEmail,
        mockCpf,
        mockPhone,
        mockPassword,
        false
      );
      
      inactiveDeliveryMan.activate();
      
      expect(inactiveDeliveryMan.isActive).toBe(true);
      expect(inactiveDeliveryMan.domainEvents).toHaveLength(1);
      expect(inactiveDeliveryMan.domainEvents[0]).toBeInstanceOf(DeliveryManActivatedEvent);
    });

    it('should not add event when activating already active delivery man', () => {
      deliveryMan.activate();
      
      expect(deliveryMan.isActive).toBe(true);
      expect(deliveryMan.domainEvents).toHaveLength(0);
    });

    it('should deactivate active delivery man and add domain event', () => {
      deliveryMan.deactivate();
      
      expect(deliveryMan.isActive).toBe(false);
      expect(deliveryMan.domainEvents).toHaveLength(1);
      expect(deliveryMan.domainEvents[0]).toBeInstanceOf(DeliveryManDeactivatedEvent);
    });

    it('should not add event when deactivating already inactive delivery man', () => {
      const inactiveDeliveryMan = new DeliveryMan(
        mockId,
        mockName,
        mockEmail,
        mockCpf,
        mockPhone,
        mockPassword,
        false
      );
      
      inactiveDeliveryMan.deactivate();
      
      expect(inactiveDeliveryMan.isActive).toBe(false);
      expect(inactiveDeliveryMan.domainEvents).toHaveLength(0);
    });
  });

  describe('Domain Events', () => {
    it('should add created event when marked as created', () => {
      deliveryMan.markAsCreated();
      
      expect(deliveryMan.domainEvents).toHaveLength(1);
      expect(deliveryMan.domainEvents[0]).toBeInstanceOf(DeliveryManCreatedEvent);
      
      const event = deliveryMan.domainEvents[0] as DeliveryManCreatedEvent;
      expect(event.deliveryManId).toBe(mockId);
      expect(event.name).toBe(mockName);
      expect(event.email).toBe(mockEmail);
      expect(event.cpf).toBe(mockCpf);
      expect(event.phone).toBe(mockPhone);
    });

    it('should add deleted event when marked as deleted', () => {
      deliveryMan.markAsDeleted();
      
      expect(deliveryMan.domainEvents).toHaveLength(1);
      expect(deliveryMan.domainEvents[0]).toBeInstanceOf(DeliveryManDeletedEvent);
      
      const event = deliveryMan.domainEvents[0] as DeliveryManDeletedEvent;
      expect(event.deliveryManId).toBe(mockId);
      expect(event.name).toBe(mockName);
    });

    it('should clear all domain events', () => {
      deliveryMan.markAsCreated();
      deliveryMan.markAsDeleted();
      
      expect(deliveryMan.domainEvents).toHaveLength(2);
      
      deliveryMan.clearEvents();
      
      expect(deliveryMan.domainEvents).toHaveLength(0);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const json = deliveryMan.toJSON();
      
      expect(json).toEqual({
        id: mockId,
        name: mockName,
        email: mockEmail,
        cpf: mockCpf,
        phone: mockPhone,
        isActive: true,
        createdAt: deliveryMan.createdAt,
        updatedAt: deliveryMan.updatedAt,
      });
    });

    it('should not include password in JSON', () => {
      const json = deliveryMan.toJSON();
      
      expect(json).not.toHaveProperty('password');
    });
  });
});
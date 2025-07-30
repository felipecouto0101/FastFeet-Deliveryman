import { DeliveryManRequestHandler } from './deliveryman-request-handler';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { FindDeliveryManByCpfUseCase } from '../../core/application/use-cases/find-deliveryman-by-cpf.use-case';
import { DeliveryMan } from '../../core/domain/entities/deliveryman.entity';
import { DeliveryManNotFoundError } from '../../core/domain/errors/deliveryman-errors';
import { ServiceRequest } from './request-response.interface';

describe('DeliveryManRequestHandler', () => {
  let handler: DeliveryManRequestHandler;
  let mockFindDeliveryManUseCase: jest.Mocked<FindDeliveryManUseCase>;
  let mockFindDeliveryManByCpfUseCase: jest.Mocked<FindDeliveryManByCpfUseCase>;

  const mockDeliveryMan = new DeliveryMan(
    '123e4567-e89b-12d3-a456-426614174000',
    'John Doe',
    'john@example.com',
    '123.456.789-00',
    '(11) 99999-9999',
    'hashedPassword'
  );

  beforeEach(() => {
    mockFindDeliveryManUseCase = {
      execute: jest.fn(),
    } as any;

    mockFindDeliveryManByCpfUseCase = {
      execute: jest.fn(),
    } as any;

    handler = new DeliveryManRequestHandler(
      mockFindDeliveryManUseCase,
      mockFindDeliveryManByCpfUseCase
    );
  });

  describe('handle', () => {
    it('should handle VALIDATE_DELIVERYMAN_BY_CPF request successfully', async () => {
      const request: ServiceRequest = {
        requestId: 'req-123',
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      mockFindDeliveryManByCpfUseCase.execute.mockResolvedValue(mockDeliveryMan);

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-123');
      expect(response.type).toBe('DELIVERYMAN_VALIDATION_RESPONSE');
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toEqual({
        id: mockDeliveryMan.id,
        email: mockDeliveryMan.email,
        name: mockDeliveryMan.name,
        cpf: mockDeliveryMan.cpf,
        passwordHash: mockDeliveryMan.password,
        isActive: mockDeliveryMan.isActive,
      });
      expect(mockFindDeliveryManByCpfUseCase.execute).toHaveBeenCalledWith('123.456.789-00');
    });

    it('should return error when CPF is missing in VALIDATE_DELIVERYMAN_BY_CPF', async () => {
      const request: ServiceRequest = {
        requestId: 'req-123',
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: {},
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-123');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('MISSING_CPF');
      expect(response.error?.message).toBe('CPF is required');
    });

    it('should return error when deliveryman not found by CPF', async () => {
      const request: ServiceRequest = {
        requestId: 'req-123',
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      mockFindDeliveryManByCpfUseCase.execute.mockRejectedValue(
        new DeliveryManNotFoundError('Delivery man not found')
      );

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-123');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('DELIVERYMAN_NOT_FOUND');
      expect(response.error?.message).toBe('Delivery man not found');
    });

    it('should handle GET_DELIVERYMAN_BY_ID request successfully', async () => {
      const request: ServiceRequest = {
        requestId: 'req-456',
        type: 'GET_DELIVERYMAN_BY_ID',
        data: { id: '123e4567-e89b-12d3-a456-426614174000' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      mockFindDeliveryManUseCase.execute.mockResolvedValue(mockDeliveryMan);

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-456');
      expect(response.type).toBe('DELIVERYMAN_DATA_RESPONSE');
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toEqual({
        id: mockDeliveryMan.id,
        email: mockDeliveryMan.email,
        name: mockDeliveryMan.name,
        cpf: mockDeliveryMan.cpf,
        phone: mockDeliveryMan.phone,
        isActive: mockDeliveryMan.isActive,
      });
      expect(mockFindDeliveryManUseCase.execute).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return error when ID is missing in GET_DELIVERYMAN_BY_ID', async () => {
      const request: ServiceRequest = {
        requestId: 'req-456',
        type: 'GET_DELIVERYMAN_BY_ID',
        data: {},
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-456');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('MISSING_ID');
      expect(response.error?.message).toBe('ID is required');
    });

    it('should return error when deliveryman not found by ID', async () => {
      const request: ServiceRequest = {
        requestId: 'req-456',
        type: 'GET_DELIVERYMAN_BY_ID',
        data: { id: '123e4567-e89b-12d3-a456-426614174000' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      mockFindDeliveryManUseCase.execute.mockRejectedValue(
        new DeliveryManNotFoundError('Delivery man not found')
      );

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-456');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('DELIVERYMAN_NOT_FOUND');
      expect(response.error?.message).toBe('Delivery man not found');
    });

    it('should handle unsupported request type', async () => {
      const request: ServiceRequest = {
        requestId: 'req-789',
        type: 'UNSUPPORTED_TYPE',
        data: {},
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-789');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('UNSUPPORTED_REQUEST_TYPE');
      expect(response.error?.message).toBe('Request type UNSUPPORTED_TYPE is not supported');
    });

    it('should handle internal errors', async () => {
      const request: ServiceRequest = {
        requestId: 'req-error',
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      const internalError = new Error('Internal server error');
      mockFindDeliveryManByCpfUseCase.execute.mockRejectedValue(internalError);

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-error');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('INTERNAL_ERROR');
      expect(response.error?.message).toBe('Internal server error');
    });

    it('should handle unexpected errors in main try-catch', async () => {
      const request: ServiceRequest = {
        requestId: 'req-unexpected',
        type: 'VALIDATE_DELIVERYMAN_BY_CPF',
        data: { cpf: '123.456.789-00' },
        replyTo: 'test-queue',
        timestamp: new Date().toISOString(),
      };

      
      jest.spyOn(handler as any, 'handleValidateByCpf').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const response = await handler.handle(request);

      expect(response.requestId).toBe('req-unexpected');
      expect(response.status).toBe('ERROR');
      expect(response.error?.code).toBe('INTERNAL_ERROR');
      expect(response.error?.message).toBe('Unexpected error');
    });
  });
});
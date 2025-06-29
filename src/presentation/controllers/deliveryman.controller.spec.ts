import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { DeliveryManController } from './deliveryman.controller';
import { CreateDeliveryManUseCase } from '../../core/application/use-cases/create-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../../core/application/use-cases/delete-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../../core/application/use-cases/update-deliveryman.use-case';
import { DeliveryMan } from '../../core/domain/entities/deliveryman.entity';
import { DeliveryManNotFoundError } from '../../core/domain/errors/deliveryman-errors';
import { HttpErrorMapper } from '../errors/http-error-mapper';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('DeliveryManController', () => {
  let controller: DeliveryManController;
  let createUseCase: jest.Mocked<CreateDeliveryManUseCase>;
  let findUseCase: jest.Mocked<FindDeliveryManUseCase>;
  let listUseCase: jest.Mocked<ListDeliveryMenUseCase>;
  let updateUseCase: jest.Mocked<UpdateDeliveryManUseCase>;
  let deleteUseCase: jest.Mocked<DeleteDeliveryManUseCase>;

  const mockDeliveryMan = new DeliveryMan(
    '123',
    'John Doe',
    'john@example.com',
    '123.456.789-00',
    '(11) 99999-9999',
    'password123'
  );

  beforeEach(async () => {
    const mockCreateUseCase = {
      execute: jest.fn(),
    };
    const mockFindUseCase = {
      execute: jest.fn(),
    };
    const mockListUseCase = {
      execute: jest.fn(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn(),
    };
    const mockDeleteUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryManController],
      providers: [
        { provide: CreateDeliveryManUseCase, useValue: mockCreateUseCase },
        { provide: FindDeliveryManUseCase, useValue: mockFindUseCase },
        { provide: ListDeliveryMenUseCase, useValue: mockListUseCase },
        { provide: UpdateDeliveryManUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteDeliveryManUseCase, useValue: mockDeleteUseCase },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<DeliveryManController>(DeliveryManController);
    createUseCase = module.get(CreateDeliveryManUseCase);
    findUseCase = module.get(FindDeliveryManUseCase);
    listUseCase = module.get(ListDeliveryMenUseCase);
    updateUseCase = module.get(UpdateDeliveryManUseCase);
    deleteUseCase = module.get(DeleteDeliveryManUseCase);
  });

  describe('create', () => {
    it('should create a delivery man successfully', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'password123',
      };

      createUseCase.execute.mockResolvedValue(mockDeliveryMan);

      const result = await controller.create(createDto);

      expect(createUseCase.execute).toHaveBeenCalledWith({
        id: expect.any(String),
        ...createDto,
      });
      expect(result).toEqual(mockDeliveryMan.toJSON());
    });

    it('should handle create error', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'password123',
      };

      const error = new Error('Create error');
      createUseCase.execute.mockRejectedValue(error);

      jest.spyOn(HttpErrorMapper, 'toHttpException').mockReturnValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(error);
      expect(HttpErrorMapper.toHttpException).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of delivery men with limit', async () => {
      const paginationQuery = { limit: 10 };
      const mockResult = {
        items: [mockDeliveryMan],
        lastEvaluatedKey: 'key123',
        hasNext: true,
      };

      listUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationQuery);

      expect(listUseCase.execute).toHaveBeenCalledWith({
        limit: 10,
        lastEvaluatedKey: undefined,
      });
      expect(result).toEqual({
        items: [mockDeliveryMan.toJSON()],
        lastEvaluatedKey: 'key123',
        hasNext: true,
        count: 1,
      });
    });

    it('should return paginated list with default limit when not provided', async () => {
      const paginationQuery = {}; 
      const mockResult = {
        items: [mockDeliveryMan],
        lastEvaluatedKey: 'key123',
        hasNext: true,
      };

      listUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.findAll(paginationQuery);

      expect(listUseCase.execute).toHaveBeenCalledWith({
        limit: 10, 
        lastEvaluatedKey: undefined,
      });
      expect(result).toEqual({
        items: [mockDeliveryMan.toJSON()],
        lastEvaluatedKey: 'key123',
        hasNext: true,
        count: 1,
      });
    });

    it('should handle findAll error', async () => {
      const paginationQuery = { limit: 10 };
      const error = new Error('List error');
      listUseCase.execute.mockRejectedValue(error);

      jest.spyOn(HttpErrorMapper, 'toHttpException').mockReturnValue(error);

      await expect(controller.findAll(paginationQuery)).rejects.toThrow(error);
      expect(HttpErrorMapper.toHttpException).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should find a delivery man by id', async () => {
      const id = '123';
      findUseCase.execute.mockResolvedValue(mockDeliveryMan);

      const result = await controller.findOne(id);

      expect(findUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockDeliveryMan.toJSON());
    });

    it('should handle findOne error', async () => {
      const id = '123';
      const error = new DeliveryManNotFoundError(id);
      findUseCase.execute.mockRejectedValue(error);

      jest.spyOn(HttpErrorMapper, 'toHttpException').mockReturnValue(error);

      await expect(controller.findOne(id)).rejects.toThrow(error);
      expect(HttpErrorMapper.toHttpException).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update a delivery man successfully', async () => {
      const id = '123';
      const updateDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      updateUseCase.execute.mockResolvedValue(mockDeliveryMan);

      const result = await controller.update(id, updateDto);

      expect(updateUseCase.execute).toHaveBeenCalledWith({
        id,
        ...updateDto,
      });
      expect(result).toEqual(mockDeliveryMan.toJSON());
    });

    it('should handle update error', async () => {
      const id = '123';
      const updateDto = { name: 'Jane Doe' };
      const error = new DeliveryManNotFoundError(id);
      updateUseCase.execute.mockRejectedValue(error);

      jest.spyOn(HttpErrorMapper, 'toHttpException').mockReturnValue(error);

      await expect(controller.update(id, updateDto)).rejects.toThrow(error);
      expect(HttpErrorMapper.toHttpException).toHaveBeenCalledWith(error);
    });
  });

  describe('remove', () => {
    it('should delete a delivery man successfully', async () => {
      const id = '123';
      deleteUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(deleteUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual({ success: true });
    });

    it('should handle delete error', async () => {
      const id = '123';
      const error = new DeliveryManNotFoundError(id);
      deleteUseCase.execute.mockRejectedValue(error);

      jest.spyOn(HttpErrorMapper, 'toHttpException').mockReturnValue(error);

      await expect(controller.remove(id)).rejects.toThrow(error);
      expect(HttpErrorMapper.toHttpException).toHaveBeenCalledWith(error);
    });
  });
});
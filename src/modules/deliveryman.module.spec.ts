import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryManModule } from './deliveryman.module';
import { CreateDeliveryManUseCase } from '../core/application/use-cases/create-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../core/application/use-cases/update-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../core/application/use-cases/delete-deliveryman.use-case';
import { DeliveryManController } from '../presentation/controllers/deliveryman.controller';
import { JwtAuthGuard } from '../presentation/guards/jwt-auth.guard';

describe('DeliveryManModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DeliveryManModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: jest.fn(() => true),
    })
    .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CreateDeliveryManUseCase', () => {
    const useCase = module.get(CreateDeliveryManUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(CreateDeliveryManUseCase);
  });

  it('should provide FindDeliveryManUseCase', () => {
    const useCase = module.get(FindDeliveryManUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(FindDeliveryManUseCase);
  });

  it('should provide ListDeliveryMenUseCase', () => {
    const useCase = module.get(ListDeliveryMenUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(ListDeliveryMenUseCase);
  });

  it('should provide UpdateDeliveryManUseCase', () => {
    const useCase = module.get(UpdateDeliveryManUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(UpdateDeliveryManUseCase);
  });

  it('should provide DeleteDeliveryManUseCase', () => {
    const useCase = module.get(DeleteDeliveryManUseCase);
    expect(useCase).toBeDefined();
    expect(useCase).toBeInstanceOf(DeleteDeliveryManUseCase);
  });

  it('should provide DeliveryManController', () => {
    const controller = module.get(DeliveryManController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(DeliveryManController);
  });
});
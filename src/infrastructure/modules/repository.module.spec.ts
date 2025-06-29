import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryModule } from './repository.module';
import { DynamoDBDeliveryManRepository } from '../repositories/dynamodb-deliveryman.repository';
import { DELIVERY_MAN_REPOSITORY } from '../../core/domain/repositories/deliveryman-repository.interface';

describe('RepositoryModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [RepositoryModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide DELIVERY_MAN_REPOSITORY', () => {
    const repository = module.get(DELIVERY_MAN_REPOSITORY);
    expect(repository).toBeDefined();
    expect(repository).toBeInstanceOf(DynamoDBDeliveryManRepository);
  });

  it('should export DELIVERY_MAN_REPOSITORY', () => {
    const repository = module.get(DELIVERY_MAN_REPOSITORY);
    expect(repository).toBeDefined();
  });
});
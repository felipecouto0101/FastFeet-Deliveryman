import { Module } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY } from '../../core/domain/repositories/deliveryman-repository.interface';
import { DynamoDBDeliveryManRepository } from '../repositories/dynamodb-deliveryman.repository';

@Module({
  providers: [
    {
      provide: DELIVERY_MAN_REPOSITORY,
      useClass: DynamoDBDeliveryManRepository,
    },
  ],
  exports: [DELIVERY_MAN_REPOSITORY],
})
export class RepositoryModule {}
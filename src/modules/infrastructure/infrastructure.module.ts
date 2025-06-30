import { Module } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY } from '../../core/domain/repositories/deliveryman-repository.interface';
import { EVENT_PUBLISHER } from '../../core/domain/events/event-publisher.interface';
import { DynamoDBDeliveryManRepository } from '../../infrastructure/repositories/dynamodb-deliveryman.repository';
import { SQSEventPublisher } from '../../infrastructure/messaging/sqs-event-publisher';
import { SQSConsumer } from '../../infrastructure/messaging/sqs-consumer';

@Module({
  providers: [
    {
      provide: DELIVERY_MAN_REPOSITORY,
      useClass: DynamoDBDeliveryManRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: SQSEventPublisher,
    },
    SQSConsumer,
  ],
  exports: [
    DELIVERY_MAN_REPOSITORY,
    EVENT_PUBLISHER,
    SQSConsumer,
  ],
})
export class InfrastructureModule {}
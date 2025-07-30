import { Module } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY } from '../../core/domain/repositories/deliveryman-repository.interface';
import { EVENT_PUBLISHER } from '../../core/domain/events/event-publisher.interface';
import { DynamoDBDeliveryManRepository } from '../../infrastructure/repositories/dynamodb-deliveryman.repository';
import { SQSEventPublisher } from '../../infrastructure/messaging/sqs-event-publisher';
import { SQSConsumer } from '../../infrastructure/messaging/sqs-consumer';
import { SQSResponsePublisher } from '../../infrastructure/messaging/sqs-response-publisher';
import { DeliveryManRequestHandler } from '../../infrastructure/messaging/deliveryman-request-handler';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { FindDeliveryManByCpfUseCase } from '../../core/application/use-cases/find-deliveryman-by-cpf.use-case';

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
    SQSResponsePublisher,
    DeliveryManRequestHandler,
    FindDeliveryManUseCase,
    FindDeliveryManByCpfUseCase,
  ],
  exports: [
    DELIVERY_MAN_REPOSITORY,
    EVENT_PUBLISHER,
    SQSConsumer,
    SQSResponsePublisher,
    DeliveryManRequestHandler,
    FindDeliveryManUseCase,
    FindDeliveryManByCpfUseCase,
  ],
})
export class InfrastructureModule {}
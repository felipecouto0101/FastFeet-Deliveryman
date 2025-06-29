import { Module } from '@nestjs/common';
import { CreateDeliveryManUseCase } from '../core/application/use-cases/create-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../core/application/use-cases/delete-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../core/application/use-cases/update-deliveryman.use-case';
import { RepositoryModule } from '../infrastructure/modules/repository.module';
import { DeliveryManController } from '../presentation/controllers/deliveryman.controller';
import { EVENT_PUBLISHER } from '../core/domain/events/event-publisher.interface';
import { SQSEventPublisher } from '../infrastructure/messaging/sqs-event-publisher';

@Module({
  imports: [RepositoryModule],
  controllers: [DeliveryManController],
  providers: [
    CreateDeliveryManUseCase,
    FindDeliveryManUseCase,
    ListDeliveryMenUseCase,
    UpdateDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    {
      provide: EVENT_PUBLISHER,
      useClass: SQSEventPublisher,
    },
  ],
})
export class DeliveryManModule {}
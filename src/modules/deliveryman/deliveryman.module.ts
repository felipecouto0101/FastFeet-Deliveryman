import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { DeliveryManController } from '../../presentation/controllers/deliveryman.controller';
import { CreateDeliveryManUseCase } from '../../core/application/use-cases/create-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../../core/application/use-cases/update-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../../core/application/use-cases/delete-deliveryman.use-case';

@Module({
  imports: [InfrastructureModule],
  controllers: [DeliveryManController],
  providers: [
    CreateDeliveryManUseCase,
    FindDeliveryManUseCase,
    ListDeliveryMenUseCase,
    UpdateDeliveryManUseCase,
    DeleteDeliveryManUseCase,
  ],
  exports: [
    CreateDeliveryManUseCase,
    FindDeliveryManUseCase,
    ListDeliveryMenUseCase,
    UpdateDeliveryManUseCase,
    DeleteDeliveryManUseCase,
  ],
})
export class DeliveryManModule {}
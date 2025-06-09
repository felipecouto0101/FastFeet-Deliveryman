import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';

export class FindDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(id: string): Promise<DeliveryMan | null> {
    return this.deliveryManRepository.findById(id);
  }
}
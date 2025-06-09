import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

export class FindDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(id: string): Promise<DeliveryMan> {
    const deliveryMan = await this.deliveryManRepository.findById(id);
    
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError(id);
    }
    
    return deliveryMan;
  }
}
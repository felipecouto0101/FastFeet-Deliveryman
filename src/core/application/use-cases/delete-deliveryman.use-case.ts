import { Inject } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

export class DeleteDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(id: string): Promise<void> {
    const deliveryMan = await this.deliveryManRepository.findById(id);
    
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError(id);
    }
    
    await this.deliveryManRepository.delete(id);
  }
}
import { Inject } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';

export class DeleteDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.deliveryManRepository.delete(id);
  }
}
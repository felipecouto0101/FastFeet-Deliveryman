import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

export class FindDeliveryManByCpfUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(cpf: string): Promise<DeliveryMan> {
    const deliveryMan = await this.deliveryManRepository.findByCpf(cpf);
    
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError(`Delivery man with CPF ${cpf} not found`);
    }
    
    return deliveryMan;
  }
}
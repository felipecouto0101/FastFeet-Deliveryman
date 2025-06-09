import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';

export interface CreateDeliveryManInput {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

export class CreateDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(input: CreateDeliveryManInput): Promise<DeliveryMan> {
    const deliveryMan = new DeliveryMan(
      input.id,
      input.name,
      input.email,
      input.cpf,
      input.phone,
      '',
    );
    
   
    await deliveryMan.setPassword(input.password);

    await this.deliveryManRepository.create(deliveryMan);

    return deliveryMan;
  }
}
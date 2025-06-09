import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';

export interface UpdateDeliveryManInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
}

export class UpdateDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(input: UpdateDeliveryManInput): Promise<DeliveryMan | null> {
    const deliveryMan = await this.deliveryManRepository.findById(input.id);

    if (!deliveryMan) {
      return null;
    }

    if (input.name) {
      deliveryMan.name = input.name;
    }

    if (input.email) {
      deliveryMan.email = input.email;
    }

    if (input.phone) {
      deliveryMan.phone = input.phone;
    }

    if (input.password) {
      await deliveryMan.setPassword(input.password);
    }

    if (input.isActive !== undefined) {
      input.isActive ? deliveryMan.activate() : deliveryMan.deactivate();
    }

    await this.deliveryManRepository.update(deliveryMan);

    return deliveryMan;
  }
}
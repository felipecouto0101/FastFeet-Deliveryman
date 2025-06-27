import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { EVENT_PUBLISHER, EventPublisher } from '../../domain/events/event-publisher.interface';

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
    private deliveryManRepository: DeliveryManRepository,
    @Inject(EVENT_PUBLISHER)
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: CreateDeliveryManInput): Promise<DeliveryMan> {
    const deliveryMan = new DeliveryMan(
      input.id,
      input.name,
      input.email,
      input.cpf,
      input.phone,
      input.password,
    );

    await deliveryMan.setPassword(input.password);
    deliveryMan.markAsCreated();

    await this.deliveryManRepository.create(deliveryMan);

    // Publish domain events
    if (deliveryMan.domainEvents.length > 0) {
      await this.eventPublisher.publishBatch(deliveryMan.domainEvents);
      deliveryMan.clearEvents();
    }

    return deliveryMan;
  }
}
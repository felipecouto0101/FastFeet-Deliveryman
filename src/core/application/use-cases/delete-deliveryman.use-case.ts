import { Inject } from '@nestjs/common';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository } from '../../domain/repositories/deliveryman-repository.interface';
import { EVENT_PUBLISHER, EventPublisher } from '../../domain/events/event-publisher.interface';
import { DeliveryManNotFoundError } from '../../domain/errors/deliveryman-errors';

export class DeleteDeliveryManUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository,
    @Inject(EVENT_PUBLISHER)
    private eventPublisher: EventPublisher
  ) {}

  async execute(id: string): Promise<void> {
    const deliveryMan = await this.deliveryManRepository.findById(id);
    
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError(id);
    }
    
    deliveryMan.markAsDeleted();
    
    // Publish domain events before deletion
    if (deliveryMan.domainEvents.length > 0) {
      await this.eventPublisher.publishBatch(deliveryMan.domainEvents);
      deliveryMan.clearEvents();
    }
    
    await this.deliveryManRepository.delete(id);
  }
}
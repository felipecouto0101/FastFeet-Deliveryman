import { Inject } from '@nestjs/common';
import { DeliveryMan } from '../../domain/entities/deliveryman.entity';
import { DELIVERY_MAN_REPOSITORY, DeliveryManRepository, PaginationParams, PaginatedResult } from '../../domain/repositories/deliveryman-repository.interface';

export class ListDeliveryMenUseCase {
  constructor(
    @Inject(DELIVERY_MAN_REPOSITORY)
    private deliveryManRepository: DeliveryManRepository
  ) {}

  async execute(params?: PaginationParams): Promise<PaginatedResult<DeliveryMan>> {
    return this.deliveryManRepository.findAll(params);
  }
}
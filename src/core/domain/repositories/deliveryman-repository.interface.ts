import { DeliveryMan } from '../entities/deliveryman.entity';

export interface DeliveryManRepository {
  create(deliveryMan: DeliveryMan): Promise<void>;
  findById(id: string): Promise<DeliveryMan | null>;
  findAll(): Promise<DeliveryMan[]>;
  update(deliveryMan: DeliveryMan): Promise<void>;
  delete(id: string): Promise<void>;
}

export const DELIVERY_MAN_REPOSITORY = 'DELIVERY_MAN_REPOSITORY';
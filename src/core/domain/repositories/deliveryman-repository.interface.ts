import { DeliveryMan } from '../entities/deliveryman.entity';

export interface PaginationParams {
  limit: number;
  lastEvaluatedKey?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  lastEvaluatedKey?: string;
  hasNext: boolean;
}

export interface DeliveryManRepository {
  create(deliveryMan: DeliveryMan): Promise<void>;
  findById(id: string): Promise<DeliveryMan | null>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<DeliveryMan>>;
  update(deliveryMan: DeliveryMan): Promise<void>;
  delete(id: string): Promise<void>;
}

export const DELIVERY_MAN_REPOSITORY = 'DELIVERY_MAN_REPOSITORY';
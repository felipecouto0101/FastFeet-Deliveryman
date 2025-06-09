import { 
  BadRequestException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { DomainError } from '../../core/domain/errors/domain-error';
import { ApplicationError } from '../../core/application/errors/application-error';
import { InfrastructureError } from '../../infrastructure/errors/infrastructure-error';
import { DeliveryManNotFoundError } from '../../core/domain/errors/deliveryman-errors';
import { DatabaseConnectionError, DatabaseQueryError } from '../../infrastructure/errors/database-errors';

export class HttpErrorMapper {
  static toHttpException(error: Error): Error {
    
    if (error instanceof DeliveryManNotFoundError) {
      return new NotFoundException(error.message);
    }
    
    if (error instanceof DomainError) {
      return new BadRequestException(error.message);
    }
    
   
    if (error instanceof DatabaseConnectionError || 
        error instanceof DatabaseQueryError) {
      return new InternalServerErrorException('A database error occurred');
    }
    
    if (error instanceof InfrastructureError) {
      return new InternalServerErrorException('An infrastructure error occurred');
    }
    
   
    if (error instanceof ApplicationError) {
      return new BadRequestException(error.message);
    }
   
    return new InternalServerErrorException('An unexpected error occurred');
  }
}
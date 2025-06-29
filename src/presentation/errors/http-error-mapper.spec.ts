import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpErrorMapper } from './http-error-mapper';
import { DeliveryManNotFoundError, InvalidEmailError, InvalidCpfError, InvalidPasswordError } from '../../core/domain/errors/deliveryman-errors';
import { DomainError } from '../../core/domain/errors/domain-error';
import { ApplicationError } from '../../core/application/errors/application-error';
import { InfrastructureError } from '../../infrastructure/errors/infrastructure-error';
import { DatabaseConnectionError, DatabaseQueryError } from '../../infrastructure/errors/database-errors';


class TestApplicationError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

class TestInfrastructureError extends InfrastructureError {
  constructor(message: string) {
    super(message);
  }
}

describe('HttpErrorMapper', () => {
  describe('toHttpException', () => {
    it('should map DeliveryManNotFoundError to NotFoundException', () => {
      const error = new DeliveryManNotFoundError('123');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.message).toBe('Delivery person with ID 123 not found');
    });

    it('should map DomainError to BadRequestException', () => {
      const error = new InvalidEmailError('invalid@email');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.message).toBe('Email invalid@email is invalid');
    });

    it('should map InvalidCpfError to BadRequestException', () => {
      const error = new InvalidCpfError('123.456.789-00');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.message).toBe('CPF 123.456.789-00 is invalid');
    });

    it('should map InvalidPasswordError to BadRequestException', () => {
      const error = new InvalidPasswordError();
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.message).toBe('Password must be at least 6 characters long');
    });

    it('should map DatabaseConnectionError to InternalServerErrorException', () => {
      const error = new DatabaseConnectionError('Connection failed');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toBe('A database error occurred');
    });

    it('should map DatabaseQueryError to InternalServerErrorException', () => {
      const error = new DatabaseQueryError('Query failed', 'SELECT * FROM users');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toBe('A database error occurred');
    });

    it('should map InfrastructureError to InternalServerErrorException', () => {
      const error = new TestInfrastructureError('Infrastructure failed');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toBe('An infrastructure error occurred');
    });

    it('should map ApplicationError to BadRequestException', () => {
      const error = new TestApplicationError('Application error');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.message).toBe('Application error');
    });

    it('should map unknown error to InternalServerErrorException', () => {
      const error = new Error('Unknown error');
      const result = HttpErrorMapper.toHttpException(error);
      
      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toBe('An unexpected error occurred');
    });
  });
});
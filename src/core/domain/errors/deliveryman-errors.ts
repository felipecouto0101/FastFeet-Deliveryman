import { DomainError } from './domain-error';

export class DeliveryManNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Delivery person with ID ${id} not found`);
  }
}

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is invalid`);
  }
}

export class InvalidCpfError extends DomainError {
  constructor(cpf: string) {
    super(`CPF ${cpf} is invalid`);
  }
}

export class InvalidPasswordError extends DomainError {
  constructor() {
    super('Password must be at least 6 characters long');
  }
}
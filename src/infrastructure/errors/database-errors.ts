import { InfrastructureError } from './infrastructure-error';

export class DatabaseConnectionError extends InfrastructureError {
  constructor(details: string) {
    super(`Database connection error: ${details}`);
  }
}

export class DatabaseQueryError extends InfrastructureError {
  constructor(operation: string, details: string) {
    super(`Database error during ${operation}: ${details}`);
  }
}
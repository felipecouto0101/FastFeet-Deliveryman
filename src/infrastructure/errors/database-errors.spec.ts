import { DatabaseConnectionError, DatabaseQueryError } from './database-errors';
import { InfrastructureError } from './infrastructure-error';

describe('Database Errors', () => {
  describe('DatabaseConnectionError', () => {
    it('should create database connection error', () => {
      const details = 'Connection timeout';
      const error = new DatabaseConnectionError(details);

      expect(error.message).toBe(`Database connection error: ${details}`);
      expect(error.name).toBe('DatabaseConnectionError');
      expect(error).toBeInstanceOf(InfrastructureError);
    });
  });

  describe('DatabaseQueryError', () => {
    it('should create database query error', () => {
      const operation = 'SELECT';
      const details = 'Table not found';
      const error = new DatabaseQueryError(operation, details);

      expect(error.message).toBe(`Database error during ${operation}: ${details}`);
      expect(error.name).toBe('DatabaseQueryError');
      expect(error).toBeInstanceOf(InfrastructureError);
    });
  });
});
import { DeliveryManNotFoundError, InvalidEmailError, InvalidCpfError, InvalidPasswordError } from './deliveryman-errors';

describe('DeliveryMan Errors', () => {
  describe('DeliveryManNotFoundError', () => {
    it('should create error with correct message', () => {
      const id = '123';
      const error = new DeliveryManNotFoundError(id);

      expect(error.message).toBe(`Delivery person with ID ${id} not found`);
      expect(error.name).toBe('DeliveryManNotFoundError');
    });
  });

  describe('InvalidEmailError', () => {
    it('should create error with correct message', () => {
      const email = 'invalid-email';
      const error = new InvalidEmailError(email);

      expect(error.message).toBe(`Email ${email} is invalid`);
      expect(error.name).toBe('InvalidEmailError');
    });
  });

  describe('InvalidCpfError', () => {
    it('should create error with correct message', () => {
      const cpf = '123.456.789-00';
      const error = new InvalidCpfError(cpf);

      expect(error.message).toBe(`CPF ${cpf} is invalid`);
      expect(error.name).toBe('InvalidCpfError');
    });
  });

  describe('InvalidPasswordError', () => {
    it('should create error with correct message', () => {
      const error = new InvalidPasswordError();

      expect(error.message).toBe('Password must be at least 6 characters long');
      expect(error.name).toBe('InvalidPasswordError');
    });
  });
});
import { ApplicationError } from './application-error';

class TestApplicationError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

describe('ApplicationError', () => {
  it('should create application error with message', () => {
    const message = 'Test application error';
    const error = new TestApplicationError(message);

    expect(error.message).toBe(message);
    expect(error.name).toBe('TestApplicationError');
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(Error);
  });
});
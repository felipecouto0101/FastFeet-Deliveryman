import { InfrastructureError } from './infrastructure-error';


class TestInfrastructureError extends InfrastructureError {
  constructor(message: string) {
    super(message);
  }
}

describe('InfrastructureError', () => {
  it('should create infrastructure error with message', () => {
    const message = 'Infrastructure service unavailable';
    const error = new TestInfrastructureError(message);

    expect(error.message).toBe(message);
    expect(error.name).toBe('TestInfrastructureError');
    expect(error).toBeInstanceOf(InfrastructureError);
    expect(error).toBeInstanceOf(Error);
  });
});
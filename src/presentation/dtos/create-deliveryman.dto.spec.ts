import { validate } from 'class-validator';
import { CreateDeliveryManDto } from './create-deliveryman.dto';

describe('CreateDeliveryManDto', () => {
  let dto: CreateDeliveryManDto;

  beforeEach(() => {
    dto = new CreateDeliveryManDto();
    dto.name = 'John Doe';
    dto.email = 'john@example.com';
    dto.cpf = '123.456.789-00';
    dto.phone = '(11) 99999-9999';
    dto.password = 'password123';
  });

  it('should validate with valid data', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty name', async () => {
    dto.name = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with invalid email', async () => {
    dto.email = 'invalid-email';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with short password', async () => {
    dto.password = '123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
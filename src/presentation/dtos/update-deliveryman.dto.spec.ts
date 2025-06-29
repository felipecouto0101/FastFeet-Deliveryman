import { validate } from 'class-validator';
import { UpdateDeliveryManDto } from './update-deliveryman.dto';

describe('UpdateDeliveryManDto', () => {
  let dto: UpdateDeliveryManDto;

  beforeEach(() => {
    dto = new UpdateDeliveryManDto();
  });

  it('should validate with valid partial data', async () => {
    dto.name = 'Jane Doe';
    dto.email = 'jane@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with empty dto (all optional)', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
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
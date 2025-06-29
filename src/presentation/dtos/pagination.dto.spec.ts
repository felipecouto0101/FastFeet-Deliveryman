import { validate } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto';

describe('PaginationQueryDto', () => {
  it('should validate with valid limit', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 10;
    dto.lastEvaluatedKey = 'test-key';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with limit too high', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 101;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with limit too low', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate without limit (optional)', async () => {
    const dto = new PaginationQueryDto();
    dto.lastEvaluatedKey = 'test-key';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
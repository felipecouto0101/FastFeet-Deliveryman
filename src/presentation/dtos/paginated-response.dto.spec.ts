import { PaginatedResponseDto } from './paginated-response.dto';

describe('PaginatedResponseDto', () => {
  it('should create paginated response with all properties', () => {
    const dto = new PaginatedResponseDto();
    dto.items = [{
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    dto.count = 1;
    dto.hasNext = true;
    dto.lastEvaluatedKey = 'test-key';

    expect(dto.items).toHaveLength(1);
    expect(dto.count).toBe(1);
    expect(dto.hasNext).toBe(true);
    expect(dto.lastEvaluatedKey).toBe('test-key');
  });

  it('should create paginated response without lastEvaluatedKey', () => {
    const dto = new PaginatedResponseDto();
    dto.items = [];
    dto.count = 0;
    dto.hasNext = false;

    expect(dto.items).toHaveLength(0);
    expect(dto.count).toBe(0);
    expect(dto.hasNext).toBe(false);
    expect(dto.lastEvaluatedKey).toBeUndefined();
  });
});
import { ResponseDeliveryManDto } from './response-deliveryman.dto';

describe('ResponseDeliveryManDto', () => {
  it('should create response dto with all properties', () => {
    const dto = new ResponseDeliveryManDto();
    dto.id = '123';
    dto.name = 'John Doe';
    dto.email = 'john@example.com';
    dto.cpf = '123.456.789-00';
    dto.phone = '(11) 99999-9999';
    dto.isActive = true;
    dto.createdAt = new Date();
    dto.updatedAt = new Date();

    expect(dto.id).toBe('123');
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john@example.com');
    expect(dto.cpf).toBe('123.456.789-00');
    expect(dto.phone).toBe('(11) 99999-9999');
    expect(dto.isActive).toBe(true);
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
  });
});
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeliveryManDto {
  @ApiProperty({
    description: 'Unique ID of the delivery person',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the delivery person',
    example: 'John Smith',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the delivery person',
    example: 'john.smith@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'CPF (Brazilian ID) of the delivery person',
    example: '123.456.789-00',
  })
  cpf: string;

  @ApiProperty({
    description: 'Phone number of the delivery person',
    example: '(11) 98765-4321',
  })
  phone: string;

  @ApiProperty({
    description: 'Active status of the delivery person',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date of the record',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the record',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
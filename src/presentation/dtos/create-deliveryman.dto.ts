import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryManDto {
  @ApiProperty({
    description: 'Full name of the delivery person',
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the delivery person',
    example: 'john.smith@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'CPF (Brazilian ID) of the delivery person',
    example: '123.456.789-00',
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'Phone number of the delivery person',
    example: '(11) 98765-4321',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
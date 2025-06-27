import { ApiProperty } from '@nestjs/swagger';
import { ResponseDeliveryManDto } from './response-deliveryman.dto';

export class PaginatedResponseDto {
  @ApiProperty({
    description: 'List of delivery people',
    type: [ResponseDeliveryManDto],
  })
  items: ResponseDeliveryManDto[];

  @ApiProperty({
    description: 'Last evaluated key for next page',
    example: 'eyJpZCI6IjEyMyJ9',
    required: false,
  })
  lastEvaluatedKey?: string;

  @ApiProperty({
    description: 'Indicates if there are more items',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Number of items in current page',
    example: 10,
  })
  count: number;
}
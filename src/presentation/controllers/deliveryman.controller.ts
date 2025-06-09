import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { CreateDeliveryManUseCase } from '../../core/application/use-cases/create-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../../core/application/use-cases/delete-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../../core/application/use-cases/update-deliveryman.use-case';
import { CreateDeliveryManDto } from '../dtos/create-deliveryman.dto';
import { UpdateDeliveryManDto } from '../dtos/update-deliveryman.dto';
import { ResponseDeliveryManDto } from '../dtos/response-deliveryman.dto';

@ApiTags('deliverymen')
@Controller('deliverymen')
export class DeliveryManController {
  constructor(
    private readonly createDeliveryManUseCase: CreateDeliveryManUseCase,
    private readonly findDeliveryManUseCase: FindDeliveryManUseCase,
    private readonly listDeliveryMenUseCase: ListDeliveryMenUseCase,
    private readonly updateDeliveryManUseCase: UpdateDeliveryManUseCase,
    private readonly deleteDeliveryManUseCase: DeleteDeliveryManUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery person' })
  @ApiBody({ type: CreateDeliveryManDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Delivery person successfully created',
    type: ResponseDeliveryManDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid data' 
  })
  async create(@Body() createDeliveryManDto: CreateDeliveryManDto) {
    const deliveryMan = await this.createDeliveryManUseCase.execute({
      id: uuidv4(),
      ...createDeliveryManDto,
    });

    return deliveryMan.toJSON();
  }

  @Get()
  @ApiOperation({ summary: 'List all delivery people' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of delivery people successfully returned',
    type: [ResponseDeliveryManDto]
  })
  async findAll() {
    const deliveryMen = await this.listDeliveryMenUseCase.execute();
    return deliveryMen.map((deliveryMan) => deliveryMan.toJSON());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a delivery person by ID' })
  @ApiParam({ name: 'id', description: 'Delivery person ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Delivery person successfully found',
    type: ResponseDeliveryManDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Delivery person not found' 
  })
  async findOne(@Param('id') id: string) {
    const deliveryMan = await this.findDeliveryManUseCase.execute(id);
    
    if (!deliveryMan) {
      throw new NotFoundException('Delivery person not found');
    }
    
    return deliveryMan.toJSON();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID' })
  @ApiBody({ type: UpdateDeliveryManDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Delivery person successfully updated',
    type: ResponseDeliveryManDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Delivery person not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid data' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateDeliveryManDto: UpdateDeliveryManDto,
  ) {
    const deliveryMan = await this.updateDeliveryManUseCase.execute({
      id,
      ...updateDeliveryManDto,
    });
    
    if (!deliveryMan) {
      throw new NotFoundException('Delivery person not found');
    }
    
    return deliveryMan.toJSON();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Delivery person successfully deleted' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Delivery person not found' 
  })
  async remove(@Param('id') id: string) {
    const deliveryMan = await this.findDeliveryManUseCase.execute(id);
    
    if (!deliveryMan) {
      throw new NotFoundException('Delivery person not found');
    }
    
    await this.deleteDeliveryManUseCase.execute(id);
    return { success: true };
  }
}
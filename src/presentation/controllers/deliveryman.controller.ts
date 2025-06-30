import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiQuery
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
import { PaginationQueryDto } from '../dtos/pagination.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { HttpErrorMapper } from '../errors/http-error-mapper';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('deliverymen')
@Controller('deliverymen')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
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
    try {
      const deliveryMan = await this.createDeliveryManUseCase.execute({
        id: uuidv4(),
        ...createDeliveryManDto,
      });

      return deliveryMan.toJSON();
    } catch (error) {
      throw HttpErrorMapper.toHttpException(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'List delivery people with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (1-100)' })
  @ApiQuery({ name: 'lastEvaluatedKey', required: false, type: String, description: 'Last evaluated key for pagination' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Paginated list of delivery people successfully returned',
    type: PaginatedResponseDto
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    try {
      const result = await this.listDeliveryMenUseCase.execute({
        limit: paginationQuery.limit || 10,
        lastEvaluatedKey: paginationQuery.lastEvaluatedKey,
      });

      return {
        items: result.items.map((deliveryMan) => deliveryMan.toJSON()),
        lastEvaluatedKey: result.lastEvaluatedKey,
        hasNext: result.hasNext,
        count: result.items.length,
      };
    } catch (error) {
      throw HttpErrorMapper.toHttpException(error);
    }
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
    try {
      const deliveryMan = await this.findDeliveryManUseCase.execute(id);
      return deliveryMan.toJSON();
    } catch (error) {
      throw HttpErrorMapper.toHttpException(error);
    }
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
    try {
      const deliveryMan = await this.updateDeliveryManUseCase.execute({
        id,
        ...updateDeliveryManDto,
      });
      
      return deliveryMan.toJSON();
    } catch (error) {
      throw HttpErrorMapper.toHttpException(error);
    }
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
    try {
      await this.deleteDeliveryManUseCase.execute(id);
      return { success: true };
    } catch (error) {
      throw HttpErrorMapper.toHttpException(error);
    }
  }
}
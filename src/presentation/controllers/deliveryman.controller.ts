import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateDeliveryManUseCase } from '../../core/application/use-cases/create-deliveryman.use-case';
import { DeleteDeliveryManUseCase } from '../../core/application/use-cases/delete-deliveryman.use-case';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { ListDeliveryMenUseCase } from '../../core/application/use-cases/list-deliverymen.use-case';
import { UpdateDeliveryManUseCase } from '../../core/application/use-cases/update-deliveryman.use-case';
import { CreateDeliveryManDto } from '../dtos/create-deliveryman.dto';
import { UpdateDeliveryManDto } from '../dtos/update-deliveryman.dto';

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
  async create(@Body() createDeliveryManDto: CreateDeliveryManDto) {
    const deliveryMan = await this.createDeliveryManUseCase.execute({
      id: uuidv4(),
      ...createDeliveryManDto,
    });

    return deliveryMan.toJSON();
  }

  @Get()
  async findAll() {
    const deliveryMen = await this.listDeliveryMenUseCase.execute();
    return deliveryMen.map((deliveryMan) => deliveryMan.toJSON());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const deliveryMan = await this.findDeliveryManUseCase.execute(id);
    
    if (!deliveryMan) {
      return null;
    }
    
    return deliveryMan.toJSON();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeliveryManDto: UpdateDeliveryManDto,
  ) {
    const deliveryMan = await this.updateDeliveryManUseCase.execute({
      id,
      ...updateDeliveryManDto,
    });
    
    if (!deliveryMan) {
      return null;
    }
    
    return deliveryMan.toJSON();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteDeliveryManUseCase.execute(id);
    return { success: true };
  }
}
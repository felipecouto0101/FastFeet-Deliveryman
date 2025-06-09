import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryManModule } from './modules/deliveryman.module';

@Module({
  imports: [DeliveryManModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
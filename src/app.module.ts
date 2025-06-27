import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryManModule } from './modules/deliveryman/deliveryman.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfrastructureModule,
    DeliveryManModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
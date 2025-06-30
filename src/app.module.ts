import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeliveryManModule } from './modules/deliveryman/deliveryman.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    InfrastructureModule,
    DeliveryManModule,
  ],
})
export class AppModule {}
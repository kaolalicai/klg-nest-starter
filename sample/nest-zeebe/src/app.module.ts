import { Module } from '@nestjs/common'
import { TypegooseModuleBuilder } from '@kalengo/mongoose'
import { ZeebeModule, ZeebeServer } from '@payk/nestjs-zeebe'
import { AppController } from './app.controller'
import { RechargeService } from './service/recharge.service'
import { Order } from './model/order.model'
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
  imports: [
    TypegooseModuleBuilder.forRoot(),
    ZeebeModule.forRoot({ gatewayAddress: 'localhost:26500' }),
    TypegooseModule.forFeature([Order])
  ],
  controllers: [AppController],
  providers: [ZeebeServer, RechargeService]
})
export class ApplicationModule {}

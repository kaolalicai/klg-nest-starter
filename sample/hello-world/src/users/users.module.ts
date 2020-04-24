import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from './model/user.model'
import { Account } from './model/account.model'

@Module({
  imports: [
    TypegooseModule.forFeature([User], 'core'),
    TypegooseModule.forFeature([Account], 'app')
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypegooseModuleBuilder } from '@kalengo/mongoose'

@Module({
  imports: [TypegooseModuleBuilder.forRoot(), UsersModule]
})
export class ApplicationModule {}

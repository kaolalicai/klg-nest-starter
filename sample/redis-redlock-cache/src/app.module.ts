import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { RedisModuleBuilder, RedlockModule } from '@kalengo/redis'

@Module({
  imports: [RedisModuleBuilder.forRoot(), RedlockModule.forRoot(), UsersModule]
})
export class ApplicationModule {}

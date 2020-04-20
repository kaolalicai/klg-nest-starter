import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
import {RedisModuleBuilder} from '@kalengo/redis'

@Module({
  imports: [
    RedisModuleBuilder.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}

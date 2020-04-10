import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
import {TypegooseModuleBuilder} from './common/mongodb/TypegooseModuleBuilder'

@Module({
  imports: [
    TypegooseModuleBuilder.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}

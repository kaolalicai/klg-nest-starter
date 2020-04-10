import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
// import {TypegooseModuleBuilder} from './common/mongodb/TypegooseModuleBuilder'
import {TypegooseModule} from 'nestjs-typegoose'
import {TypegooseModuleBuilder} from './common/mongodb/TypegooseModuleBuilder'

@Module({
  imports: [
    // TypegooseModule.forRoot('mongodb://localhost:57017/nest', {
    //   connectionName: 'core'
    // }),
    TypegooseModuleBuilder.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}

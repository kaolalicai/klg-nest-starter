import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { keycloak } from './keycloak'

@Module({
  imports: [UsersModule]
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(keycloak.protect('realm:admin'))
      .forRoutes({ path: '/users/protect', method: RequestMethod.GET })
    consumer
      .apply(keycloak.protect('realm:user'))
      .forRoutes({ path: '/users/', method: RequestMethod.GET })
  }
}

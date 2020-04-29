import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { UsersModule } from './users/users.module'
import { KeycloakConnectModule, AuthGuard, RolesGuard } from '@kalengo/keycloak'

@Module({
  imports: [KeycloakConnectModule.forRoot({}), UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class ApplicationModule {}

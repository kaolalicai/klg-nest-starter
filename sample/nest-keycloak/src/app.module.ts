import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { KeycloakConnectModule } from '@kalengo/keycloak'

@Module({
  imports: [KeycloakConnectModule.forRoot({}), UsersModule]
})
export class ApplicationModule {}

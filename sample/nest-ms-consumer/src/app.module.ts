import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypegooseModuleBuilder } from '@kalengo/mongoose'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { TransformInterceptor, HttpExceptionFilter } from '@kalengo/web'

@Module({
  imports: [TypegooseModuleBuilder.forRoot(), UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class ApplicationModule {}

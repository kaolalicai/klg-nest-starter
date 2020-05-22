import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypegooseModuleBuilder } from '@kalengo/mongoose'
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core'
import {
  TransformInterceptor,
  HttpExceptionFilter,
  ParamsValidationPipe
} from '@kalengo/web'

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
    },
    {
      provide: APP_PIPE,
      useClass: ParamsValidationPipe
    }
  ]
})
export class ApplicationModule {}

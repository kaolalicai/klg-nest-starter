import * as morgan from 'morgan'
import { INestApplication } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from '@kalengo/web'

export const prefix = 'api/v1'

export function appSettings(app: INestApplication) {
  app.setGlobalPrefix(prefix)

  // request log
  app.use(morgan('tiny'))

  // 错误处理和返回值format
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
}

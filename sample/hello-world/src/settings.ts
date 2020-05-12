import * as morgan from 'morgan'
import { INestApplication } from '@nestjs/common'

export const prefix = 'api/v1'

export function appSettings(app: INestApplication) {
  app.setGlobalPrefix(prefix)

  // request log
  app.use(morgan('tiny'))
}

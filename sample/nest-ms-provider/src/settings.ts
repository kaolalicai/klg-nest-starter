import { INestApplication } from '@nestjs/common'

export const prefix = 'api/v1'

export function appSettings(app: INestApplication) {
  app.setGlobalPrefix(prefix)
}

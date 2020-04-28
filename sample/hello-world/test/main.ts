import * as supertest from 'supertest'
import { ApplicationModule } from '../src/app.module'
import { Test } from '@nestjs/testing'
import { appSettings } from '../src/settings'
export { prefix } from '../src/settings'

export async function bootstrap() {
  // init nestjs
  const testModule = await Test.createTestingModule({
    imports: [ApplicationModule]
  }).compile()
  const app = testModule.createNestApplication()
  appSettings(app)
  await app.init()
  const request = supertest(app.getHttpServer())
  return { app, request, testModule }
}
